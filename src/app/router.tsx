import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ExpedientesPage } from '@/pages/ExpedientesPage';
import { ExpedienteDetailPage } from '@/pages/ExpedienteDetailPage';
import { RacksPage } from '@/pages/RacksPage';
import { RackDetailPage } from '@/pages/RackDetailPage';
import { LocationDetailPage } from '@/pages/LocationDetailPage';
import { ScannerPage } from '@/pages/ScannerPage';
import { ScanByCodePage } from '@/pages/ScanByCodePage';
import { QRGeneratorPage } from '@/pages/QRGeneratorPage';
import { MovementsPage } from '@/pages/MovementsPage';
import { EntradaPage } from '@/pages/EntradaPage';
import { SalidaPage } from '@/pages/SalidaPage';
import { DevolucionPage } from '@/pages/DevolucionPage';
import { TrasladoPage } from '@/pages/TrasladoPage';
import { ImportPage } from '@/pages/ImportPage';
import { ExportPage } from '@/pages/ExportPage';
import { UsersPage } from '@/pages/UsersPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { AuditPage } from '@/pages/AuditPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  // Rutas públicas
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/scan/:locationCode',
    element: <ScanByCodePage />,
  },
  
  // Rutas protegidas
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: <DashboardPage />,
          },
          {
            path: 'expedientes',
            element: <ExpedientesPage />,
          },
          {
            path: 'expedientes/:id',
            element: <ExpedienteDetailPage />,
          },
          {
            path: 'racks',
            element: <RacksPage />,
          },
          {
            path: 'racks/:rackCode',
            element: <RackDetailPage />,
          },
          {
            path: 'locations/:locationCode',
            element: <LocationDetailPage />,
          },
          {
            path: 'movements',
            element: <ProtectedRoute allowedRoles={['admin', 'archivista']} />,
            children: [{ index: true, element: <MovementsPage /> }],
          },
          {
            path: 'movements/entrada',
            element: <ProtectedRoute allowedRoles={['admin', 'archivista']} />,
            children: [{ index: true, element: <EntradaPage /> }],
          },
          {
            path: 'movements/salida',
            element: <ProtectedRoute allowedRoles={['admin', 'archivista']} />,
            children: [{ index: true, element: <SalidaPage /> }],
          },
          {
            path: 'movements/devolucion',
            element: <ProtectedRoute allowedRoles={['admin', 'archivista']} />,
            children: [{ index: true, element: <DevolucionPage /> }],
          },
          {
            path: 'movements/traslado',
            element: <ProtectedRoute allowedRoles={['admin', 'archivista']} />,
            children: [{ index: true, element: <TrasladoPage /> }],
          },
          {
            path: 'scan',
            element: <ScannerPage />,
          },
          {
            path: 'qr-generator',
            element: <ProtectedRoute allowedRoles={['admin']} />,
            children: [{ index: true, element: <QRGeneratorPage /> }],
          },
          {
            path: 'import',
            element: <ProtectedRoute allowedRoles={['admin', 'archivista']} />,
            children: [{ index: true, element: <ImportPage /> }],
          },
          {
            path: 'export',
            element: <ProtectedRoute allowedRoles={['admin', 'archivista']} />,
            children: [{ index: true, element: <ExportPage /> }],
          },
          {
            path: 'audit',
            element: <ProtectedRoute allowedRoles={['admin', 'archivista']} />,
            children: [{ index: true, element: <AuditPage /> }],
          },
          {
            path: 'users',
            element: (
              <ProtectedRoute allowedRoles={['admin']} />
            ),
            children: [
              {
                index: true,
                element: <UsersPage />,
              },
            ],
          },
          {
            path: 'settings',
            element: <SettingsPage />,
          },
          {
            path: '*',
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },
]);