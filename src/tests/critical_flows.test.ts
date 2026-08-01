import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createExpressApp } from '../backend/app';

const app = createExpressApp();
let authToken: string;

describe('MedOcupa ERP - Pruebas Funcionales Críticas (Flujo Ocupacional Real)', () => {

  beforeAll(async () => {
    // Autenticarse como médico ocupacional
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'medico@rsa.pe', password: 'medico123' });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.token).toBeDefined();
    authToken = loginRes.body.token;
  });

  it('FLUJO 1: Crear trabajador -> Programar EMO -> Dictaminar Aptitud -> Reporte MINSA', async () => {
    const randomDni = `${Math.floor(10000000 + Math.random() * 90000000)}`;

    // 1. Crear nuevo trabajador de RSA
    const resWorker = await request(app)
      .post('/api/trabajadores')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        empresaId: 'emp-1',
        sedeId: 'sede-1',
        tipoDocumento: 'DNI',
        numeroDocumento: randomDni,
        nombres: 'Carlos Alberto',
        apellidoPaterno: 'Mendoza',
        apellidoMaterno: 'Vargas',
        fechaNacimiento: '1988-05-14',
        sexo: 'M',
        telefono: '987654321',
        email: 'cmendoza@empresa.pe',
        puestoTrabajo: 'Operador de Maquinaria Pesada',
        area: 'Mantenimiento Mecánico',
        grupoOcupacional: 'OPERATIVO',
        fechaIngreso: '2023-02-01',
        factoresRiesgo: [
          { tipo: 'FISICO', descripcion: 'Ruido continuo > 85dB', intensidadNivel: 'ALTO' },
          { tipo: 'ERGONOMICO', descripcion: 'Levantamiento de cargas', intensidadNivel: 'MEDIO' }
        ],
        estado: 'ACTIVO'
      });

    expect(resWorker.status).toBe(201);
    expect(resWorker.body.success).toBe(true);
    const workerId = resWorker.body.data.id;
    expect(workerId).toBeDefined();

    // 2. Programar Examen Médico Ocupacional (EMO Periódico)
    const codigoEmo = `EMO-TEST-${Date.now()}`;
    const resEmo = await request(app)
      .post('/api/emos')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        codigoEMO: codigoEmo,
        trabajadorId: workerId,
        empresaId: 'emp-1',
        tipoEMO: 'PERIODICO',
        fechaProgramada: '2026-08-01',
        estado: 'PROGRAMADO',
        protocoloAplicado: 'Protocolo Minero R.M. 312-2011 Anexo 01',
        costoEMO: 320.00,
        evaluaciones: {
          triaje: true, medicinaGeneral: true, audiometria: true,
          espirometria: true, radiografiaOIT: true, laboratorio: true,
          psicologia: true, oftalmologia: true, electrocardiograma: true
        }
      });

    expect(resEmo.status).toBe(201);
    expect(resEmo.body.success).toBe(true);
    const emoId = resEmo.body.data.id;

    // 3. Dictaminar Certificado de Aptitud Médica
    const resAptitud = await request(app)
      .post('/api/aptitud')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        emoId,
        aptitud: {
          resultado: 'APTO_CON_RESTRICCIONES',
          fechaEmision: '2026-08-01',
          fechaVencimiento: '2027-08-01',
          restricciones: ['Uso obligatorio de protección auditiva amoldada (NRR 29dB)', 'No levantar cargas > 25kg'],
          recomendaciones: ['Control audiométrico en 6 meses', 'Pausas activas ergométricas'],
          vigilanciaSugerida: ['Programa de Conservación Auditiva'],
          medicoFirmante: 'Dr. Roberto Silva Alva',
          cmpFirmante: 'CMP: 65432'
        }
      });

    expect(resAptitud.status).toBe(200);
    expect(resAptitud.body.success).toBe(true);

    // 4. Verificar presencia en Reporte MINSA / MTPE
    const resMinsa = await request(app)
      .get('/api/reportes_minsa')
      .set('Authorization', `Bearer ${authToken}`);

    expect(resMinsa.status).toBe(200);
    expect(resMinsa.body.success).toBe(true);
    expect(resMinsa.body.data).toBeDefined();
  });

  it('FLUJO 2: Crear accidente incapacitante -> Notificación / Registro SAT (24h)', async () => {
    const codigoAcc = `ACC-TEST-${Date.now()}`;

    const resAcc = await request(app)
      .post('/api/accidentes')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        codigoEvento: codigoAcc,
        empresaId: 'emp-1',
        trabajadorId: 'trab-1',
        tipo: 'ACCIDENTE_INCAPACITANTE',
        fechaHora: '2026-07-30T10:30',
        lugarExacto: 'Taller Mecánico Principal Sede Central',
        descripcionHechos: 'Atrapamiento leve de miembro superior derecho durante mantenimiento.',
        parteCuerpoAfectada: 'Mano derecha (dedo índice)',
        diagnosticoCIE10: 'S61.0 - Herida de dedo de la mano',
        diasIncapacidad: 5,
        notificadoMTPE: true,
        codigoRegistroSAT: 'SAT-MTPE-2026-987654',
        causasRaiz: ['Falta de bloqueo LOTO en equipo'],
        medidasCorrectivas: ['Implementar procedimiento LOTO antes de intervenciones'],
        estadoInvestigacion: 'EN_INVESTIGACION'
      });

    expect(resAcc.status).toBe(201);
    expect(resAcc.body.success).toBe(true);
    expect(resAcc.body.data.codigoRegistroSAT).toBe('SAT-MTPE-2026-987654');
    expect(resAcc.body.data.notificadoMTPE).toBe(true);
  });
});
