-- Table pour les paramètres globaux de la plateforme
CREATE TABLE IF NOT EXISTS platform_settings (
    id SERIAL PRIMARY KEY,
    site_name VARCHAR(255) NOT NULL DEFAULT 'Cloud Nexus Platform',
    site_description TEXT,
    site_icon_url TEXT DEFAULT '/favicon.ico',
    site_logo_url TEXT DEFAULT '/logo.png',
    primary_color VARCHAR(50) DEFAULT '#3b82f6',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID -- Référence à l'admin qui a fait la modif
);

-- Insertion de la configuration par défaut (si n'existe pas)
INSERT INTO platform_settings (id, site_name, site_icon_url, site_logo_url)
VALUES (1, 'Cloud Nexus Platform', '/favicon.ico', '/logo.png')
ON CONFLICT (id) DO NOTHING;
