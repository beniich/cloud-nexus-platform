-- =====================================================
-- TABLES POUR LE SYSTÈME DE PAIEMENT MULTI-RÔLES
-- =====================================================

-- Table de configuration du système de paiement
CREATE TABLE IF NOT EXISTS payment_config (
    id SERIAL PRIMARY KEY,
    
    -- Stripe
    stripe_enabled BOOLEAN DEFAULT FALSE,
    stripe_public_key VARCHAR(255),
    stripe_secret_key TEXT, -- Crypté
    stripe_webhook_secret TEXT, -- Crypté
    stripe_supported_currencies JSONB DEFAULT '["EUR", "USD"]'::jsonb,
    
    -- PayPal
    paypal_enabled BOOLEAN DEFAULT FALSE,
    paypal_client_id VARCHAR(255),
    paypal_client_secret TEXT, -- Crypté
    paypal_mode VARCHAR(20) DEFAULT 'sandbox', -- 'sandbox' ou 'live'
    paypal_supported_currencies JSONB DEFAULT '["EUR", "USD"]'::jsonb,
    
    -- Commissions
    default_vendor_rate DECIMAL(5,2) DEFAULT 10.00, -- %
    admin_fee DECIMAL(5,2) DEFAULT 5.00, -- %
    payment_processing_fee DECIMAL(5,2) DEFAULT 2.90, -- %
    minimum_payout DECIMAL(10,2) DEFAULT 50.00, -- €
    
    -- Taxes
    taxes_enabled BOOLEAN DEFAULT TRUE,
    default_tax_rate DECIMAL(5,4) DEFAULT 0.20, -- 20%
    tax_rates_by_country JSONB DEFAULT '{"FR": 0.20, "BE": 0.21, "DE": 0.19}'::jsonb,
    taxes_included_in_price BOOLEAN DEFAULT FALSE,
    
    -- Facturation
    invoicing_auto_generate BOOLEAN DEFAULT TRUE,
    invoicing_prefix VARCHAR(20) DEFAULT 'CN-',
    invoicing_starting_number INTEGER DEFAULT 1000,
    invoicing_current_number INTEGER DEFAULT 1000,
    company_info JSONB,
    invoicing_footer_text TEXT,
    
    -- Notifications
    notifications JSONB DEFAULT '{
        "email": {"onPurchase": true, "onCommission": true, "onPayout": true, "onRefund": true},
        "sms": {"enabled": false, "onPurchase": false},
        "push": {"enabled": true, "onPurchase": true, "onCommission": true}
    }'::jsonb,
    
    -- Métadonnées
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255)
);

-- Table de configuration spécifique vendeur
CREATE TABLE IF NOT EXISTS vendor_payment_config (
    id SERIAL PRIMARY KEY,
    vendor_id VARCHAR(255) NOT NULL UNIQUE,
    
    -- Commission personnalisée (override du taux global)
    custom_commission_rate DECIMAL(5,2), -- Si NULL, utilise le taux par défaut
    
    -- Programme de paiement
    payout_schedule VARCHAR(20) DEFAULT 'monthly', -- 'daily', 'weekly', 'bi-weekly', 'monthly'
    payout_method VARCHAR(50) DEFAULT 'bank_transfer', -- 'bank_transfer', 'paypal', 'stripe'
    
    -- Détails bancaires
    bank_account_holder VARCHAR(255),
    bank_iban VARCHAR(34),
    bank_bic VARCHAR(11),
    
    -- Détails PayPal/Stripe
    paypal_email VARCHAR(255),
    stripe_account_id VARCHAR(255),
    
    -- Options
    auto_payout_enabled BOOLEAN DEFAULT FALSE,
    minimum_payout DECIMAL(10,2), -- Override du minimum global
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des commissions
CREATE TABLE IF NOT EXISTS commissions (
    id SERIAL PRIMARY KEY,
    
    vendor_id VARCHAR(255) NOT NULL,
    order_id VARCHAR(255) NOT NULL,
    
    -- Montants
    order_amount DECIMAL(10,2) NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL, -- % appliqué
    commission_amount DECIMAL(10,2) NOT NULL, -- Montant brut de la commission
    platform_fee DECIMAL(10,2) DEFAULT 0, -- Frais plateforme
    processing_fee DECIMAL(10,2) DEFAULT 0, -- Frais Stripe/PayPal
    net_amount DECIMAL(10,2) NOT NULL, -- Ce que le vendeur reçoit
    
    -- Statut
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'paid', 'cancelled'
    paid_at TIMESTAMP,
    
    -- Métadonnées
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (vendor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des paiements aux vendeurs
CREATE TABLE IF NOT EXISTS vendor_payouts (
    id SERIAL PRIMARY KEY,
    
    vendor_id VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    
    -- Commissions incluses
    commission_ids JSONB, -- Array des IDs de commissions
    
    -- Méthode
    method VARCHAR(50) NOT NULL, -- 'bank_transfer', 'paypal', 'stripe'
    
    -- Statut
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    transaction_id VARCHAR(255), -- ID de la transaction bancaire/PayPal/Stripe
    failure_reason TEXT,
    
    -- Audit
    initiated_by VARCHAR(255) NOT NULL, -- ID admin qui a initié
    initiated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    
    FOREIGN KEY (vendor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des commandes (simplifiée, à adapter selon votre schéma existant)
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(255) PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    
    user_id VARCHAR(255) NOT NULL,
    vendor_id VARCHAR(255), -- NULL si vendu par la plateforme
    
    -- Montants
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    
    -- Items
    items JSONB NOT NULL,
    
    -- Statut
    status VARCHAR(20) DEFAULT 'pending_payment',
    payment_status VARCHAR(20) DEFAULT 'pending',
    payment_method_id VARCHAR(255),
    payment_provider VARCHAR(50), -- 'stripe', 'paypal', etc.
    
    -- Métadonnées
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des factures
CREATE TABLE IF NOT EXISTS invoices (
    id VARCHAR(255) PRIMARY KEY,
    order_id VARCHAR(255) NOT NULL,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Dates
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP,
    
    -- Montants
    amount DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    
    -- Détails
    billing_details JSONB NOT NULL,
    items JSONB NOT NULL,
    
    -- Statut
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'sent', 'paid', 'overdue', 'cancelled'
    pdf_url TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Table d'audit des actions sensibles
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    
    user_id VARCHAR(255) NOT NULL,
    action VARCHAR(50) NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE'
    entity_type VARCHAR(50) NOT NULL, -- 'payment_config', 'commission', 'payout', etc.
    entity_id VARCHAR(255),
    details JSONB,
    ip_address VARCHAR(45),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_commissions_vendor ON commissions(vendor_id);
CREATE INDEX IF NOT EXISTS idx_commissions_order ON commissions(order_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON commissions(status);
CREATE INDEX IF NOT EXISTS idx_payouts_vendor ON vendor_payouts(vendor_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON vendor_payouts(status);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_vendor ON orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_invoices_order ON invoices(order_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

-- Triggers pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_payment_config_updated_at BEFORE UPDATE ON payment_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendor_payment_config_updated_at BEFORE UPDATE ON vendor_payment_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commissions_updated_at BEFORE UPDATE ON commissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Vues utiles
CREATE OR REPLACE VIEW vendor_commission_summary AS
SELECT 
    vendor_id,
    COUNT(*) as total_commissions,
    SUM(CASE WHEN status = 'pending' THEN net_amount ELSE 0 END) as pending_amount,
    SUM(CASE WHEN status = 'approved' THEN net_amount ELSE 0 END) as approved_amount,
    SUM(CASE WHEN status = 'paid' THEN net_amount ELSE 0 END) as paid_amount,
    SUM(net_amount) as total_amount
FROM commissions
GROUP BY vendor_id;

-- Commentaires
COMMENT ON TABLE payment_config IS 'Configuration globale du système de paiement';
COMMENT ON TABLE vendor_payment_config IS 'Configuration de paiement spécifique à chaque vendeur';
COMMENT ON TABLE commissions IS 'Commissions des vendeurs sur les ventes';
COMMENT ON TABLE vendor_payouts IS 'Historique des paiements aux vendeurs';
COMMENT ON TABLE audit_logs IS 'Journal d''audit pour les actions sensibles';
