import fs from 'fs';
import path from 'path';

const dataStorePath = path.join(process.cwd(), 'data_store.json');

async function main() {
  console.log('🚀 Iniciando migración de data_store.json a PostgreSQL vía Prisma...');

  if (!fs.existsSync(dataStorePath)) {
    console.log('⚠️ No se encontró data_store.json. Nada que migrar.');
    return;
  }

  // Importar PrismaClient dinámicamente según la generación de esquema
  let PrismaClientModule: any;
  try {
    PrismaClientModule = await import('@prisma/client');
  } catch (err) {
    console.error('❌ Error al cargar @prisma/client. Asegúrese de haber ejecutado npx prisma generate.');
    process.exit(1);
  }

  const PrismaClient = PrismaClientModule.PrismaClient || PrismaClientModule.default?.PrismaClient;
  if (!PrismaClient) {
    console.error('❌ PrismaClient no disponible en @prisma/client.');
    process.exit(1);
  }

  const prisma = new PrismaClient();

  const raw = fs.readFileSync(dataStorePath, 'utf8');
  const data = JSON.parse(raw);

  // 1. Usuarios
  if (data.users && Array.isArray(data.users)) {
    console.log(`👤 Migrando ${data.users.length} usuarios...`);
    for (const u of data.users) {
      await prisma.usuario.upsert({
        where: { email: u.email },
        update: { nombre: u.nombre, rol: u.rol, cmp_rnm: u.cmp_rnm, cep: u.cep, empresaId: u.empresaId, avatar: u.avatar },
        create: {
          id: u.id,
          nombre: u.nombre,
          email: u.email,
          rol: u.rol || 'MEDICO_OCUPACIONAL',
          cmp_rnm: u.cmp_rnm,
          cep: u.cep,
          empresaId: u.empresaId,
          avatar: u.avatar || ''
        }
      });
    }
  }

  // 2. Empresas
  if (data.empresas && Array.isArray(data.empresas)) {
    console.log(`🏢 Migrando ${data.empresas.length} empresas...`);
    for (const e of data.empresas) {
      await prisma.empresa.upsert({
        where: { ruc: e.ruc },
        update: {
          razonSocial: e.razonSocial,
          nombreComercial: e.nombreComercial,
          ciiu: e.ciiu,
          actividadEconomica: e.actividadEconomica,
          direccion: e.direccion,
          departamento: e.departamento,
          provincia: e.provincia,
          distrito: e.distrito,
          nivelRiesgoSCTR: e.nivelRiesgoSCTR,
          totalTrabajadores: e.totalTrabajadores || 0,
          contactoNombre: e.contactoNombre,
          contactoEmail: e.contactoEmail,
          contactoTelefono: e.contactoTelefono,
          estado: e.estado || 'ACTIVA',
          sedes: e.sedes ? JSON.parse(JSON.stringify(e.sedes)) : []
        },
        create: {
          id: e.id,
          ruc: e.ruc,
          razonSocial: e.razonSocial,
          nombreComercial: e.nombreComercial,
          ciiu: e.ciiu,
          actividadEconomica: e.actividadEconomica,
          direccion: e.direccion,
          departamento: e.departamento,
          provincia: e.provincia,
          distrito: e.distrito,
          nivelRiesgoSCTR: e.nivelRiesgoSCTR || 'ALTO',
          totalTrabajadores: e.totalTrabajadores || 0,
          contactoNombre: e.contactoNombre,
          contactoEmail: e.contactoEmail,
          contactoTelefono: e.contactoTelefono,
          estado: e.estado || 'ACTIVA',
          sedes: e.sedes ? JSON.parse(JSON.stringify(e.sedes)) : []
        }
      });
    }
  }

  // 3. Trabajadores
  if (data.trabajadores && Array.isArray(data.trabajadores)) {
    console.log(`👷 Migrando ${data.trabajadores.length} trabajadores...`);
    for (const t of data.trabajadores) {
      await prisma.trabajador.upsert({
        where: { numeroDocumento: t.numeroDocumento },
        update: {
          empresaId: t.empresaId,
          sedeId: t.sedeId,
          nombres: t.nombres,
          apellidoPaterno: t.apellidoPaterno,
          apellidoMaterno: t.apellidoMaterno,
          puestoTrabajo: t.puestoTrabajo,
          area: t.area,
          grupoOcupacional: t.grupoOcupacional,
          factoresRiesgo: t.factoresRiesgo ? JSON.parse(JSON.stringify(t.factoresRiesgo)) : [],
          estado: t.estado || 'ACTIVO'
        },
        create: {
          id: t.id,
          empresaId: t.empresaId,
          sedeId: t.sedeId,
          tipoDocumento: t.tipoDocumento || 'DNI',
          numeroDocumento: t.numeroDocumento,
          nombres: t.nombres,
          apellidoPaterno: t.apellidoPaterno,
          apellidoMaterno: t.apellidoMaterno,
          fechaNacimiento: t.fechaNacimiento || '1990-01-01',
          sexo: t.sexo || 'M',
          telefono: t.telefono,
          email: t.email,
          puestoTrabajo: t.puestoTrabajo,
          area: t.area,
          grupoOcupacional: t.grupoOcupacional,
          fechaIngreso: t.fechaIngreso || '2020-01-01',
          factoresRiesgo: t.factoresRiesgo ? JSON.parse(JSON.stringify(t.factoresRiesgo)) : [],
          estado: t.estado || 'ACTIVO'
        }
      });
    }
  }

  console.log('✅ Migración a PostgreSQL completada con éxito.');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('❌ Error durante la migración:', e);
  process.exit(1);
});
