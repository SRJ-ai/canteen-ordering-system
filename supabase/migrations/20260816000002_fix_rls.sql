-- Fix RLS Policies to allow guest/table sessions and server inserts

DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
CREATE POLICY "Users can insert own orders" ON orders FOR INSERT WITH CHECK (
  auth.uid() = user_id OR user_id IS NULL OR is_admin()
);

DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (
  auth.uid() = user_id OR user_id IS NULL OR is_admin()
);

DROP POLICY IF EXISTS "Admins can update orders" ON orders;
CREATE POLICY "Admins can update orders" ON orders FOR UPDATE USING (
  auth.uid() = user_id OR is_admin()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow insert order items" ON order_items;
CREATE POLICY "Allow insert order items" ON order_items FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow select order items" ON order_items;
CREATE POLICY "Allow select order items" ON order_items FOR SELECT USING (true);

ALTER TABLE order_item_addons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow insert order item addons" ON order_item_addons;
CREATE POLICY "Allow insert order item addons" ON order_item_addons FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow select order item addons" ON order_item_addons;
CREATE POLICY "Allow select order item addons" ON order_item_addons FOR SELECT USING (true);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow insert payments" ON payments;
CREATE POLICY "Allow insert payments" ON payments FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow select payments" ON payments;
CREATE POLICY "Allow select payments" ON payments FOR SELECT USING (true);

ALTER TABLE order_notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow insert order notes" ON order_notes;
CREATE POLICY "Allow insert order notes" ON order_notes FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow select order notes" ON order_notes;
CREATE POLICY "Allow select order notes" ON order_notes FOR SELECT USING (true);

ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow insert order status history" ON order_status_history;
CREATE POLICY "Allow insert order status history" ON order_status_history FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow select order status history" ON order_status_history;
CREATE POLICY "Allow select order status history" ON order_status_history FOR SELECT USING (true);
