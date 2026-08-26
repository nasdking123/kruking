-- ==============================================================================
-- MIGRATION 20260826000003: HARDENED RLS POLICIES & SERVER-SIDE DATA PROTECTION
-- ==============================================================================

-- Helper function to check if current user is admin or teacher
CREATE OR REPLACE FUNCTION public.is_admin_or_teacher()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'teacher')
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. POINT TRANSACTIONS RLS (STRICT IMMUTABLE LEDGER)
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "point_tx_select" ON public.point_transactions;
CREATE POLICY "point_tx_select" ON public.point_transactions
  FOR SELECT
  USING (
    auth.uid() = user_id 
    OR public.is_admin_or_teacher()
  );

DROP POLICY IF EXISTS "point_tx_insert" ON public.point_transactions;
CREATE POLICY "point_tx_insert" ON public.point_transactions
  FOR INSERT
  WITH CHECK (
    public.is_admin_or_teacher()
  );

DROP POLICY IF EXISTS "point_tx_update" ON public.point_transactions;
CREATE POLICY "point_tx_update" ON public.point_transactions
  FOR UPDATE
  USING (
    public.is_admin_or_teacher()
  );

DROP POLICY IF EXISTS "point_tx_delete" ON public.point_transactions;
CREATE POLICY "point_tx_delete" ON public.point_transactions
  FOR DELETE
  USING (
    public.is_admin_or_teacher()
  );

-- 2. ASSIGNMENT SUBMISSIONS RLS
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sub_select" ON public.assignment_submissions;
CREATE POLICY "sub_select" ON public.assignment_submissions
  FOR SELECT
  USING (
    auth.uid() = user_id 
    OR public.is_admin_or_teacher() 
    OR is_in_portfolio = true
  );

DROP POLICY IF EXISTS "sub_insert" ON public.assignment_submissions;
CREATE POLICY "sub_insert" ON public.assignment_submissions
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
  );

DROP POLICY IF EXISTS "sub_update" ON public.assignment_submissions;
CREATE POLICY "sub_update" ON public.assignment_submissions
  FOR UPDATE
  USING (
    auth.uid() = user_id 
    OR public.is_admin_or_teacher()
  );

-- 3. STUDENT CERTIFICATES RLS
ALTER TABLE public.student_certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cert_select" ON public.student_certificates;
CREATE POLICY "cert_select" ON public.student_certificates
  FOR SELECT
  USING (
    status = 'approved' 
    OR auth.uid() = user_id 
    OR public.is_admin_or_teacher()
  );

DROP POLICY IF EXISTS "cert_insert" ON public.student_certificates;
CREATE POLICY "cert_insert" ON public.student_certificates
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
  );

DROP POLICY IF EXISTS "cert_update" ON public.student_certificates;
CREATE POLICY "cert_update" ON public.student_certificates
  FOR UPDATE
  USING (
    public.is_admin_or_teacher()
  );

-- 4. STUDENT AWARDS RLS
ALTER TABLE public.student_awards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "award_select" ON public.student_awards;
CREATE POLICY "award_select" ON public.student_awards
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "award_modify" ON public.student_awards;
CREATE POLICY "award_modify" ON public.student_awards
  FOR ALL
  USING (public.is_admin_or_teacher());

-- 5. COMPETITIONS RLS
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "comp_select" ON public.competitions;
CREATE POLICY "comp_select" ON public.competitions FOR SELECT USING (true);

DROP POLICY IF EXISTS "comp_modify" ON public.competitions;
CREATE POLICY "comp_modify" ON public.competitions FOR ALL USING (public.is_admin_or_teacher());

DROP POLICY IF EXISTS "comp_results_select" ON public.competition_results;
CREATE POLICY "comp_results_select" ON public.competition_results FOR SELECT USING (true);

DROP POLICY IF EXISTS "comp_results_modify" ON public.competition_results;
CREATE POLICY "comp_results_modify" ON public.competition_results FOR ALL USING (public.is_admin_or_teacher());
