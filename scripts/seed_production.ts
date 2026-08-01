import bcrypt from 'bcryptjs';

async function seedMasterData() {
  console.log('🌱 Iniciando Sembrado de Datos Maestros de Producción (MedOcupa ERP)...');

  let PrismaClientModule: any;
  try {
    PrismaClientModule = await import('@prisma/client');
  } catch (err) {
    console.error('❌ Error al cargar @prisma/client. Ejecute npx prisma generate primero.');
    process.exit(1);
  }

  const PrismaClient = PrismaClientModule.PrismaClient || PrismaClientModule.default?.PrismaClient;
  if (!PrismaClient) {
    console.error('❌ PrismaClient no disponible.');
    process.exit(1);
  }

  const prisma = new PrismaClient();

  // 1. Usuarios Administrador e Iniciales con hash de contraseña
  const hashedPasswordAdmin = await bcrypt.hash('Admin2026!MedOcupa', 10);
  const hashedPasswordMedico = await bcrypt.hash('Medico2026!MedOcupa', 10);

  console.log('👤 Creando/Actualizando Usuarios del Sistema...');
  await prisma.usuario.upsert({
    where: { email: 'admin@medocupa.pe' },
    update: {
      nombre: 'Administrador General SST',
      rol: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    },
    create: {
      id: 'usr-admin-prod',
      email: 'admin@medocupa.pe',
      nombre: 'Administrador General SST',
      password: hashedPasswordAdmin,
      rol: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    }
  });

  await prisma.usuario.upsert({
    where: { email: 'medico@medocupa.pe' },
    update: {
      nombre: 'Dr. Roberto Silva Alva',
      rol: 'MEDICO_OCUPACIONAL',
      cmp_rnm: 'CMP: 65432 / RNE: 32104',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150'
    },
    create: {
      id: 'usr-medico-prod',
      email: 'medico@medocupa.pe',
      nombre: 'Dr. Roberto Silva Alva',
      password: hashedPasswordMedico,
      rol: 'MEDICO_OCUPACIONAL',
      cmp_rnm: 'CMP: 65432 / RNE: 32104',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150'
    }
  });

  // 2. Protocolos de Exámenes Médicos Ocupacionales (EMO) por Sector (R.M. 312-2011/MINSA)
  console.log('📋 Insertando Protocolos EMO por Sector Industrial...');
  const protocolos = [
    {
      codigoProtocolo: 'PROT-MIN-001',
      nombreProtocolo: 'Protocolo de Evaluación Médica Ocupacional en Minería de Socavón y Tajo Abierto',
      sectorActividad: 'MINERIA',
      tipoEvaluacion: 'INGRESO_PERIODICO_RETIRO',
      normaLegalBase: 'R.M. 312-2011/MINSA (Anexo 01) & D.S. 024-2016-EM',
      descripcionBateria: 'Triaje, Espirometría (FVC/FEV1), Audiometría Tonal en cabina, Radiografía de Tórax OIT (Neumoconiosis), Electrocardiograma, Laboratorio completo (Perfil lipídico, renal, hemograma, toxicología metales pesados), Evaluación Oftalmológica y Psicología Ocupacional.',
      version: '2.0',
      fechaAprobacion: '2026-01-15'
    },
    {
      codigoProtocolo: 'PROT-CONS-002',
      nombreProtocolo: 'Protocolo para Trabajos de Alto Riesgo en Construcción Civil (Alturas y Espacios Confinados)',
      sectorActividad: 'CONSTRUCCION',
      tipoEvaluacion: 'INGRESO_PERIODICO',
      normaLegalBase: 'G.050 Seguridad durante la Construcción & R.M. 312-2011/MINSA',
      descripcionBateria: 'Triaje, Tamizaje Cardiovascular, Glucosa en ayunas, Audiometría, Test de Vértigo/Equilibrio (Test de Romberg), Evaluación Musculoesquelética Avanzada, Examen Psicológico para Trabajos en Altura.',
      version: '1.5',
      fechaAprobacion: '2026-02-01'
    },
    {
      codigoProtocolo: 'PROT-AGRO-003',
      nombreProtocolo: 'Protocolo de Vigilancia Sanitaria para Exposición a Plaguicidas en Agroindustria',
      sectorActividad: 'AGROINDUSTRIA',
      tipoEvaluacion: 'PERIODICO_ESTACIONAL',
      normaLegalBase: 'Ley 29783 & R.M. 312-2011/MINSA (Anexo 02)',
      descripcionBateria: 'Medición de Colinesterasa Sérica y Eritrocitaria Basal/Control, Hemograma Completo, Perfil Hepático (TGO/TGP), Evaluación Dermatológica Ocupacional, Espirometría.',
      version: '1.2',
      fechaAprobacion: '2026-03-10'
    }
  ];

  for (const prot of protocolos) {
    await prisma.protocoloExamenMedico.upsert({
      where: { codigoProtocolo: prot.codigoProtocolo },
      update: {
        nombreProtocolo: prot.nombreProtocolo,
        sectorActividad: prot.sectorActividad,
        descripcionBateria: prot.descripcionBateria,
        normaLegalBase: prot.normaLegalBase
      },
      create: {
        codigoProtocolo: prot.codigoProtocolo,
        nombreProtocolo: prot.nombreProtocolo,
        sectorActividad: prot.sectorActividad,
        tipoEvaluacion: prot.tipoEvaluacion,
        normaLegalBase: prot.normaLegalBase,
        descripcionBateria: prot.descripcionBateria,
        version: prot.version,
        fechaAprobacion: prot.fechaAprobacion
      }
    });
  }

  // 3. Registros de Auditoría Inmutables de Inicialización
  console.log('🔒 Registrando evento de auditoría de inicio de producción...');
  await prisma.auditLog.create({
    data: {
      timestamp: new Date().toISOString(),
      usuario: 'ADMIN_SISTEMA',
      rol: 'ADMIN',
      accion: 'DEPLOY_PRODUCCION_SEED',
      recurso: 'SISTEMA_MEDOCUPA',
      ip: '127.0.0.1',
      resultado: 'EXITO',
      detalles: 'Sembrado inicial de datos maestros, roles RBAC y protocolos ocupacionales completado de forma segura.'
    }
  });

  console.log('✅ Sembrado de Datos Maestros finalizado con éxito.');
  await prisma.$disconnect();
}

seedMasterData().catch((e) => {
  console.error('❌ Error durante el seed:', e);
  process.exit(1);
});
