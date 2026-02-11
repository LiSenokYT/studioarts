-- ============================================
-- Supabase Storage Policies Setup
-- ============================================
-- Этот скрипт настраивает политики доступа (RLS) для уже созданных бакетов
-- Предполагается, что вы уже создали три публичных бакета:
-- 1. order-images (для скриншотов оплаты)
-- 2. final-works (для готовых работ)
-- 3. gallery-images (для примеров работ в галерее)

-- ============================================
-- Политики для бакета 'order-images'
-- ============================================

-- Разрешить всем просматривать изображения заказов
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'order-images');

-- Разрешить аутентифицированным пользователям загружать изображения
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'order-images');

-- Разрешить аутентифицированным пользователям обновлять изображения
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'order-images');

-- Разрешить аутентифицированным пользователям удалять изображения
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'order-images');

-- ============================================
-- Политики для бакета 'final-works'
-- ============================================

-- Разрешить всем просматривать готовые работы
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'final-works');

-- Разрешить аутентифицированным пользователям загружать работы
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'final-works');

-- Разрешить аутентифицированным пользователям обновлять работы
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'final-works');

-- Разрешить аутентифицированным пользователям удалять работы
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'final-works');

-- ============================================
-- Политики для бакета 'gallery-images'
-- ============================================

-- Разрешить всем просматривать галерею
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'gallery-images');

-- Разрешить аутентифицированным пользователям загружать в галерею
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gallery-images');

-- Разрешить аутентифицированным пользователям обновлять галерею
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'gallery-images');

-- Разрешить аутентифицированным пользователям удалять из галереи
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'gallery-images');

-- ============================================
-- Готово!
-- ============================================
-- Все три бакета теперь настроены с политиками:
-- - Публичный доступ на чтение для всех
-- - Полный доступ (загрузка/обновление/удаление) для аутентифицированных пользователей
--
-- Инструкция:
-- 1. Откройте Supabase Dashboard → SQL Editor
-- 2. Скопируйте весь этот код
-- 3. Вставьте и нажмите "Run"


