-- ============================================================================
-- COMPLETE SUPABASE SCHEMA & PRE-SEEDED DATA (RUPEES - INR ₹)
-- CANTEEN CUSTOMER ORDERING SYSTEM
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('PENDING', 'CONFIRMED', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('CREATED', 'PENDING', 'AUTHORIZED', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED', 'PARTIALLY_REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM ('SUPER_ADMIN', 'ADMIN', 'KITCHEN_STAFF', 'CASHIER', 'CUSTOMER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. TABLES
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS canteens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name user_role_enum NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    UNIQUE(user_id, role_id)
);

CREATE TABLE IF NOT EXISTS canteen_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    canteen_id UUID REFERENCES canteens(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    UNIQUE(canteen_id, user_id)
);

CREATE TABLE IF NOT EXISTS tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    canteen_id UUID REFERENCES canteens(id) ON DELETE CASCADE,
    table_number TEXT NOT NULL,
    qr_code TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS table_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_id UUID REFERENCES tables(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS table_qr_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_id UUID REFERENCES tables(id) ON DELETE CASCADE,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    canteen_id UUID REFERENCES canteens(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menu_item_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price_override DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menu_item_addons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    is_multiple BOOLEAN DEFAULT FALSE,
    is_required BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS menu_item_addon_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    addon_id REFERENCES menu_item_addons(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price_adjustment DECIMAL(10,2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS menu_item_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS menu_item_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    day_of_week INTEGER,
    start_time TIME,
    end_time TIME
);

CREATE TABLE IF NOT EXISTS allergens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS menu_item_allergens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    allergen_id UUID REFERENCES allergens(id) ON DELETE CASCADE,
    UNIQUE(menu_item_id, allergen_id)
);

CREATE TABLE IF NOT EXISTS carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    session_id UUID REFERENCES table_sessions(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    session_id UUID REFERENCES table_sessions(id) ON DELETE SET NULL,
    canteen_id UUID REFERENCES canteens(id) ON DELETE CASCADE,
    status order_status DEFAULT 'PENDING',
    total_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS order_item_addons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_item_id UUID REFERENCES order_items(id) ON DELETE CASCADE,
    addon_option_id UUID REFERENCES menu_item_addon_options(id) ON DELETE SET NULL,
    price_adjustment DECIMAL(10,2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    status order_status NOT NULL,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS order_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    status payment_status DEFAULT 'PENDING',
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
    transaction_reference TEXT,
    gateway_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS refunds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS kitchen_stations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    canteen_id UUID REFERENCES canteens(id) ON DELETE CASCADE,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS kitchen_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    station_id UUID REFERENCES kitchen_stations(id) ON DELETE SET NULL,
    status order_status DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    email_enabled BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT FALSE,
    push_enabled BOOLEAN DEFAULT TRUE,
    UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    action TEXT NOT NULL,
    old_data JSONB,
    new_data JSONB,
    performed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TRIGGERS FOR UPDATED_AT
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$ BEGIN
    CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER update_organizations_modtime BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER update_canteens_modtime BEFORE UPDATE ON canteens FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER update_tables_modtime BEFORE UPDATE ON tables FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER update_categories_modtime BEFORE UPDATE ON categories FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER update_menu_items_modtime BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER update_menu_item_variants_modtime BEFORE UPDATE ON menu_item_variants FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER update_carts_modtime BEFORE UPDATE ON carts FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER update_cart_items_modtime BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER update_orders_modtime BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER update_payments_modtime BEFORE UPDATE ON payments FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER update_system_settings_modtime BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 5. RLS POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() AND r.name IN ('SUPER_ADMIN', 'ADMIN')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$ BEGIN
  CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (is_admin());
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can view own cart" ON carts FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert own cart" ON carts FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update own cart" ON carts FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can view all orders" ON orders FOR ALL USING (is_admin());
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 6. SEED DATA (PRICES IN INDIAN RUPEES ₹)
INSERT INTO roles (id, name) VALUES 
('11111111-1111-1111-1111-111111111111', 'SUPER_ADMIN'),
('22222222-2222-2222-2222-222222222222', 'ADMIN'),
('33333333-3333-3333-3333-333333333333', 'KITCHEN_STAFF'),
('44444444-4444-4444-4444-444444444444', 'CASHIER'),
('55555555-5555-5555-5555-555555555555', 'CUSTOMER')
ON CONFLICT (name) DO NOTHING;

INSERT INTO payment_methods (id, name) VALUES
('aa111111-1111-1111-1111-111111111111', 'UPI (GPay / PhonePe / Paytm)'),
('aa222222-2222-2222-2222-222222222222', 'Credit / Debit Card'),
('aa333333-3333-3333-3333-333333333333', 'Cash at Counter'),
('aa444444-4444-4444-4444-444444444444', 'Net Banking')
ON CONFLICT (name) DO NOTHING;

INSERT INTO allergens (id, name) VALUES
('b1111111-1111-1111-1111-111111111111', 'Dairy / Milk Products'),
('b2222222-2222-2222-2222-222222222222', 'Gluten / Wheat'),
('b3333333-3333-3333-3333-333333333333', 'Nuts / Peanuts'),
('b4444444-4444-4444-4444-444444444444', 'Mustard Seeds'),
('b5555555-5555-5555-5555-555555555555', 'Sesame')
ON CONFLICT (name) DO NOTHING;

INSERT INTO organizations (id, name) VALUES
('c0000000-0000-0000-0000-000000000001', 'Tech Hub Campus')
ON CONFLICT (id) DO NOTHING;

INSERT INTO canteens (id, organization_id, name) VALUES
('c1000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Central Food Court & Cafe')
ON CONFLICT (id) DO NOTHING;

INSERT INTO tables (id, canteen_id, table_number, qr_code) VALUES
('d0000001-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Table 01', 'qr_tbl_01_8fK29xQm7P7wL9a1'),
('d0000002-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 'Table 02', 'qr_tbl_02_9gL30yRn8Q8xM0b2'),
('d0000003-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000003', 'Table 03', 'qr_tbl_03_0hM41zSo9R9yN1c3'),
('d0000004-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000004', 'Table 04', 'qr_tbl_04_1iN52aTp0S0zO2d4'),
('d0000005-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000005', 'Table 05', 'qr_tbl_05_2jO63bUq1T1aP3e5'),
('d0000006-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000006', 'Table 06', 'qr_tbl_06_3kP74cVr2U2bQ4f6'),
('d0000007-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000007', 'Table 07', 'qr_tbl_07_4lQ85dWs3V3cR5g7'),
('d0000008-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000008', 'Table 08', 'qr_tbl_08_5mR96eXt4W4dS6h8'),
('d0000009-0000-0000-0000-000000000009', 'c1000000-0000-0000-0000-000000000009', 'Table 09', 'qr_tbl_09_6nS07fYu5X5eT7i9'),
('d0000010-0000-0000-0000-000000000010', 'c1000000-0000-0000-0000-000000000010', 'Table 10', 'qr_tbl_10_7oT18gZv6Y6fU8j0')
ON CONFLICT (id) DO NOTHING;

INSERT INTO kitchen_stations (id, canteen_id, name) VALUES
('e1000001-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Main Hot Kitchen'),
('e1000002-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 'Beverage & Juice Bar'),
('e1000003-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000003', 'Chai & Snacks Counter')
ON CONFLICT (id) DO NOTHING;

INSERT INTO categories (id, canteen_id, name) VALUES
('f1000001-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'South Indian Breakfast'),
('f1000002-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 'North Indian Meals & Thali'),
('f1000003-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000003', 'Quick Bites & Evening Snacks'),
('f1000004-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000001', 'Beverages, Chai & Coffee'),
('f1000005-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000001', 'Desserts & Sweets')
ON CONFLICT (id) DO NOTHING;

INSERT INTO menu_items (id, category_id, name, description, base_price, is_available) VALUES
('10000001-0000-0000-0000-000000000001', 'f1000001-0000-0000-0000-000000000001', 'Crispy Masala Dosa', 'Golden crispy rice crepe filled with spiced potato masala, served with 2 chutneys and sambar.', 70.00, true),
('10000002-0000-0000-0000-000000000002', 'f1000001-0000-0000-0000-000000000001', 'Idli Vada Combo', 'Steamed soft idlis (2 pcs) and crispy medu vada (1 pc) with hot lentil sambar and coconut chutney.', 55.00, true),
('10000003-0000-0000-0000-000000000003', 'f1000001-0000-0000-0000-000000000001', 'Ghee Podi Thatte Idli', 'Thick plate idli smeared with aromatic spiced gun powder (podi) and pure desi ghee.', 60.00, true),
('10000004-0000-0000-0000-000000000004', 'f1000001-0000-0000-0000-000000000001', 'Onion Rava Dosa', 'Crispy semolina crepe tempered with chopped onions, green chilies, and cumin seeds.', 80.00, true),
('10000005-0000-0000-0000-000000000005', 'f1000001-0000-0000-0000-000000000001', 'Poori Bhaji (3 Pcs)', 'Fluffy deep-fried whole wheat pooris served with lightly spiced potato kurma.', 65.00, true),

('10000006-0000-0000-0000-000000000006', 'f1000002-0000-0000-0000-000000000002', 'Deluxe Executive Thali', 'Complete meal: Paneer Butter Masala, Dal Makhani, Dry Veg Sabzi, 3 Butter Rotis, Jeera Rice, Sweet, Curd & Salad.', 160.00, true),
('10000007-0000-0000-0000-000000000007', 'f1000002-0000-0000-0000-000000000002', 'Amritsari Chole Bhature', 'Two large crispy puffed bhaturas served with spicy authentic chickpea curry, pickled onions and chili.', 95.00, true),
('10000008-0000-0000-0000-000000000008', 'f1000002-0000-0000-0000-000000000002', 'Paneer Butter Masala Combo', 'Rich cottage cheese gravy in buttery tomato sauce served with 2 Layered Parathas & Steamed Rice.', 140.00, true),
('10000009-0000-0000-0000-000000000009', 'f1000002-0000-0000-0000-000000000002', 'Homestyle Rajma Chawal Bowl', 'Slow-cooked red kidney beans in thick gravy over fragrant basmati rice.', 85.00, true),
('10000010-0000-0000-0000-000000000010', 'f1000002-0000-0000-0000-000000000002', 'Hyderabadi Veg Dum Biryani', 'Layered basmati rice cooked with fresh seasonal vegetables and aromatic spices, served with Mirchi Ka Salan & Raita.', 120.00, true),

('10000011-0000-0000-0000-000000000011', 'f1000003-0000-0000-0000-000000000003', 'Butter Pav Bhaji', 'Spiced mashed mixed vegetable curry topped with generous butter, served with 2 toasted pavs.', 80.00, true),
('10000012-0000-0000-0000-000000000012', 'f1000003-0000-0000-0000-000000000003', 'Mumbai Vada Pav (2 Pcs)', 'Spicy potato fritter encased in a soft bread bun with dry garlic chutney and fried green chili.', 45.00, true),
('10000013-0000-0000-0000-000000000013', 'f1000003-0000-0000-0000-000000000003', 'Crispy Punjabi Samosa (2 Pcs)', 'Deep fried pastry filled with spiced potatoes and green peas, served with tamarind and mint chutney.', 35.00, true),
('10000014-0000-0000-0000-000000000014', 'f1000003-0000-0000-0000-000000000003', 'Paneer Tikka Kathi Roll', 'Grilled marinated paneer cubes rolled in flaky paratha with mint mayonnaise and sliced onions.', 85.00, true),
('10000015-0000-0000-0000-000000000015', 'f1000003-0000-0000-0000-000000000003', 'Peri Peri French Fries', 'Crispy potato fries tossed in tangy & spicy peri peri seasoning mix.', 55.00, true),

('10000016-0000-0000-0000-000000000016', 'f1000004-0000-0000-0000-000000000004', 'Special Adrak Elaichi Chai', 'Freshly brewed hot milk tea infused with crushed ginger and aromatic green cardamom.', 20.00, true),
('10000017-0000-0000-0000-000000000017', 'f1000004-0000-0000-0000-000000000004', 'South Indian Filter Coffee', 'Traditional decoction coffee served hot and frothy in a steel dabarah set.', 25.00, true),
('10000018-0000-0000-0000-000000000018', 'f1000004-0000-0000-0000-000000000004', 'Thick Cold Coffee with Ice Cream', 'Chilled creamy blended coffee topped with a scoop of vanilla ice cream.', 65.00, true),
('10000019-0000-0000-0000-000000000019', 'f1000004-0000-0000-0000-000000000004', 'Punjabi Sweet Lassi', 'Chilled churned yogurt drink topped with malai and cardamom.', 45.00, true),
('10000020-0000-0000-0000-000000000020', 'f1000004-0000-0000-0000-000000000004', 'Fresh Lime Soda (Sweet & Salt)', 'Refreshing sparkling soda with fresh squeezed lemon juice and mint.', 35.00, true),

('10000021-0000-0000-0000-000000000021', 'f1000005-0000-0000-0000-000000000005', 'Warm Gulab Jamun (2 Pcs)', 'Soft melt-in-mouth milk solids dumplings soaked in rose cardamom sugar syrup.', 45.00, true),
('10000022-0000-0000-0000-000000000022', 'f1000005-0000-0000-0000-000000000005', 'Kesar Pista Rasmalai (2 Pcs)', 'Delicate cottage cheese discs soaked in saffron cardamom thickened milk.', 65.00, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO menu_item_addons (id, menu_item_id, name, is_multiple, is_required) VALUES
('a0000001-0000-0000-0000-000000000001', '10000001-0000-0000-0000-000000000001', 'Dosa Add-ons', true, false),
('a0000002-0000-0000-0000-000000000011', '10000011-0000-0000-0000-000000000011', 'Pav Bhaji Add-ons', true, false),
('a0000003-0000-0000-0000-000000000006', '10000006-0000-0000-0000-000000000006', 'Thali Add-ons', true, false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO menu_item_addon_options (id, addon_id, name, price_adjustment) VALUES
('o0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'Extra Desi Ghee', 15.00),
('o0000002-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'Grated Amul Cheese', 25.00),
('o0000003-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'Extra Bowl of Sambar', 15.00),
('o0000004-0000-0000-0000-000000000002', 'a0000002-0000-0000-0000-000000000002', 'Extra Pair of Butter Pav (2 Pcs)', 20.00),
('o0000005-0000-0000-0000-000000000002', 'a0000002-0000-0000-0000-000000000002', 'Extra Cheese Topping', 25.00),
('o0000006-0000-0000-0000-000000000003', 'a0000003-0000-0000-0000-000000000003', 'Extra Butter Roti', 12.00),
('o0000007-0000-0000-0000-000000000003', 'a0000003-0000-0000-0000-000000000003', 'Extra Sweet (Gulab Jamun)', 25.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO system_settings (id, key, value) VALUES
('s0000001-0000-0000-0000-000000000001', 'canteen_info', '{"name": "Central Food Court", "currency": "INR", "currency_symbol": "₹", "tax_rate_percent": 5.0, "is_open": true}'::jsonb),
('s0000002-0000-0000-0000-000000000002', 'payment_settings', '{"upi_enabled": true, "card_enabled": true, "cash_enabled": true, "upi_vpa": "canteen@upi"}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
