-- Migration: Fix Orders UPDATE policy for KDS & Admin and Audit Logs
DROP POLICY IF EXISTS "Admins can update orders" ON orders;
DROP POLICY IF EXISTS "Allow update orders" ON orders;
DROP POLICY IF EXISTS "Allow public update on orders" ON orders;

CREATE POLICY "Allow update orders" ON orders FOR UPDATE
USING (true)
WITH CHECK (true);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow insert audit logs" ON audit_logs;
CREATE POLICY "Allow insert audit logs" ON audit_logs FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow select audit logs" ON audit_logs;
CREATE POLICY "Allow select audit logs" ON audit_logs FOR SELECT USING (true);
