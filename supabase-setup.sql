-- ============================================
-- OPHIR ESTATE - Supabase Setup (Mise à jour)
-- Exécuter dans : Supabase Dashboard > SQL Editor > New query
-- ============================================

-- 1. Ajouter la colonne 'role' à admin_credentials
ALTER TABLE admin_credentials ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'admin';

-- 2. Mettre à jour le compte admin existant
UPDATE admin_credentials SET role = 'admin'
WHERE email = 'contactFormulaire@ophirestateFormulaire.com';

-- 3. Insérer le compte développeur
INSERT INTO admin_credentials (email, password, role)
VALUES ('contact@yathra.fr', 'Ravinox_tuto789', 'dev');

-- 4. Ajouter les nouvelles colonnes à properties
ALTER TABLE properties ADD COLUMN IF NOT EXISTS visible_from DATE;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS nearby_visits TEXT;

-- 5. Politiques RLS pour INSERT/UPDATE/DELETE sur properties
CREATE POLICY "Allow insert properties" ON properties FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update properties" ON properties FOR UPDATE USING (true);
CREATE POLICY "Allow delete properties" ON properties FOR DELETE USING (true);

-- ============================================
-- IMPORTANT : Créer le bucket Storage manuellement
-- Supabase Dashboard > Storage > New Bucket
-- Nom : property-images
-- Cocher : Public bucket
-- ============================================
