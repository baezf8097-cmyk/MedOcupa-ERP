import express from 'express';
import authRoutes from './routes/auth.routes';
import empresasRoutes from './routes/empresas.routes';
import trabajadoresRoutes from './routes/trabajadores.routes';
import emoRoutes from './routes/emo.routes';
import historiaClinicaRoutes from './routes/historia_clinica.routes';
import aptitudRoutes from './routes/aptitud.routes';
import accidentesRoutes from './routes/accidentes.routes';
import vacunasRoutes from './routes/vacunas.routes';
import ausentismoRoutes from './routes/ausentismo.routes';
import vigilanciaRoutes from './routes/vigilancia.routes';
import reportesMinsaRoutes from './routes/reportes_minsa.routes';
import protocolosRoutes from './routes/protocolos.routes';
import auditRoutes from './routes/audit.routes';

export function createExpressApp() {
  const app = express();

  app.use(express.json({ limit: '10mb' }));

  // API Health Endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'MedOcupa ERP API', timestamp: new Date().toISOString() });
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/empresas', empresasRoutes);
  app.use('/api/trabajadores', trabajadoresRoutes);
  app.use('/api/emos', emoRoutes);
  app.use('/api/historia_clinica', historiaClinicaRoutes);
  app.use('/api/aptitud', aptitudRoutes);
  app.use('/api/accidentes', accidentesRoutes);
  app.use('/api/vacunas', vacunasRoutes);
  app.use('/api/ausentismo', ausentismoRoutes);
  app.use('/api/vigilancia', vigilanciaRoutes);
  app.use('/api/reportes_minsa', reportesMinsaRoutes);
  app.use('/api/protocolos', protocolosRoutes);
  app.use('/api/audit', auditRoutes);

  return app;
}
