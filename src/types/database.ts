export type UserRole = 'admin' | 'archivista' | 'consulta';
export type ExpedienteStatus = 'available' | 'borrowed' | 'inactive';
export type MovementType = 'ENTRY' | 'EXIT' | 'RETURN' | 'TRANSFER';

export type Profile = {
  id: string;
  full_name: string | null;
  email: string;
  role: UserRole;
  created_by_admin: boolean;
  suspended: boolean;
  created_at: string;
  updated_at: string;
};

export type Rack = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  active: boolean;
  created_at: string;
};

export type Location = {
  id: string;
  rack_id: string;
  level: number;
  code: string;
  qr_token: string;
  capacity: number | null;
  description: string | null;
  created_at: string;
  // Joined
  rack?: Rack;
};

export type Expediente = {
  id: string;
  code: string;
  name: string | null;
  description: string | null;
  notes: string | null;
  location_id: string | null;
  status: ExpedienteStatus;
  created_at: string;
  updated_at: string;
  // Joined
  location?: Location;
};

export type Movement = {
  id: string;
  expediente_id: string;
  user_id: string;
  type: MovementType;
  from_location_id: string | null;
  to_location_id: string | null;
  reason: string | null;
  notes: string | null;
  created_at: string;
  // Joined
  expediente?: Expediente;
  user?: Profile;
  from_location?: Location;
  to_location?: Location;
};
// Al final del archivo database.ts, reemplaza la sección "Database" con:

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: UserRole;
          created_by_admin?: boolean;
          suspended?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string | null;
          email?: string;
          role?: UserRole;
          created_by_admin?: boolean;
          suspended?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      racks: {
        Row: Rack;
        Insert: {
          id?: string;
          code: string;
          name: string;
          description?: string | null;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          code?: string;
          name?: string;
          description?: string | null;
          active?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: 'locations_rack_id_fkey';
            columns: ['id'];
            isOneToOne: false;
            referencedRelation: 'locations';
            referencedColumns: ['rack_id'];
          },
        ];
      };
      locations: {
        Row: Location;
        Insert: {
          id?: string;
          rack_id: string;
          level: number;
          code: string;
          qr_token: string;
          capacity?: number | null;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          rack_id?: string;
          level?: number;
          code?: string;
          qr_token?: string;
          capacity?: number | null;
          description?: string | null;
        };
        Relationships: [];
      };
      expedientes: {
        Row: Expediente;
        Insert: {
          id?: string;
          code: string;
          name?: string | null;
          description?: string | null;
          notes?: string | null;
          location_id?: string | null;
          status?: ExpedienteStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          code?: string;
          name?: string | null;
          description?: string | null;
          notes?: string | null;
          location_id?: string | null;
          status?: ExpedienteStatus;
          updated_at?: string;
        };
        Relationships: [];
      };
      movements: {
        Row: Movement;
        Insert: {
          id?: string;
          expediente_id: string;
          user_id: string;
          type: MovementType;
          from_location_id?: string | null;
          to_location_id?: string | null;
          reason?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          reason?: string | null;
          notes?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      registrar_entrada: {
        Args: {
          p_code: string;
          p_name: string;
          p_description: string;
          p_notes: string;
          p_location_id: string;
        };
        Returns: string;
      };
      registrar_salida: {
        Args: {
          p_expediente_id: string;
          p_reason: string;
          p_notes: string;
        };
        Returns: string;
      };
      registrar_devolucion: {
        Args: {
          p_expediente_id: string;
          p_location_id: string;
          p_notes: string;
        };
        Returns: string;
      };
      registrar_traslado: {
        Args: {
          p_expediente_id: string;
          p_new_location_id: string;
          p_notes: string;
        };
        Returns: string;
      };
      buscar_expedientes: {
        Args: {
          p_query: string;
          p_limit?: number;
        };
        Returns: Array<{
          id: string;
          code: string;
          name: string | null;
          status: ExpedienteStatus;
          location_code: string | null;
          rack_name: string | null;
          level: number | null;
          rank: number;
        }>;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}