-- ============================================================
-- INNOVA - Complete Database Schema
-- PostgreSQL / Supabase compatible
-- ============================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- Enum Types
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
    CREATE TYPE user_role_enum AS ENUM ('contributor', 'poster', 'admin');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'oauth_provider_enum') THEN
    CREATE TYPE oauth_provider_enum AS ENUM ('google', 'linkedin');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'experience_level_enum') THEN
    CREATE TYPE experience_level_enum AS ENUM ('Beginner', 'Intermediate', 'Expert');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'organisation_type_enum') THEN
    CREATE TYPE organisation_type_enum AS ENUM ('Corporation', 'Startup', 'Government', 'Academic', 'Individual');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'team_size_enum') THEN
    CREATE TYPE team_size_enum AS ENUM ('1-10', '11-50', '51-200', '201-1000', '1000+');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_tier_enum') THEN
    CREATE TYPE subscription_tier_enum AS ENUM ('starter', 'growth', 'enterprise');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'challenge_status_enum') THEN
    CREATE TYPE challenge_status_enum AS ENUM (
      'draft', 'funding_pending', 'active', 'sealed', 'revealing',
      'collaborating', 'judging', 'completed', 'cancelled'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'complexity_level_enum') THEN
    CREATE TYPE complexity_level_enum AS ENUM ('Beginner', 'Intermediate', 'Expert', 'Open');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'escrow_status_enum') THEN
    CREATE TYPE escrow_status_enum AS ENUM (
      'pending', 'funded', 'partially_released', 'fully_released', 'refunded', 'disputed'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'escrow_transaction_type_enum') THEN
    CREATE TYPE escrow_transaction_type_enum AS ENUM (
      'deposit', 'prize_release', 'platform_fee', 'refund', 'partial_refund', 'cancellation_fee'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'escrow_transaction_status_enum') THEN
    CREATE TYPE escrow_transaction_status_enum AS ENUM ('initiated', 'processing', 'completed', 'failed');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'submission_status_enum') THEN
    CREATE TYPE submission_status_enum AS ENUM ('sealed', 'revealed', 'disqualified', 'withdrawn');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'attribution_type_enum') THEN
    CREATE TYPE attribution_type_enum AS ENUM ('original', 'fork', 'merge', 'collaborative');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'annotation_type_enum') THEN
    CREATE TYPE annotation_type_enum AS ENUM ('suggestion', 'critique', 'endorsement');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'collaboration_edge_type_enum') THEN
    CREATE TYPE collaboration_edge_type_enum AS ENUM ('fork', 'merge', 'annotate', 'credit');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'judge_score_type_enum') THEN
    CREATE TYPE judge_score_type_enum AS ENUM ('oss', 'cjs');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'prize_disbursement_status_enum') THEN
    CREATE TYPE prize_disbursement_status_enum AS ENUM (
      'pending', 'processing', 'completed', 'failed', 'reversed'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'bank_account_type_enum') THEN
    CREATE TYPE bank_account_type_enum AS ENUM ('savings', 'current', 'upi');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'recruiter_tier_enum') THEN
    CREATE TYPE recruiter_tier_enum AS ENUM ('basic', 'professional', 'enterprise');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type_enum') THEN
    CREATE TYPE notification_type_enum AS ENUM (
      'phase_transition', 'prize_distributed', 'ipar_recorded', 'submission_revealed',
      'collaboration_activity', 'challenge_ending', 'score_updated', 'payment_confirmed', 'system'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'related_entity_type_enum') THEN
    CREATE TYPE related_entity_type_enum AS ENUM ('challenge', 'submission', 'ipar', 'disbursement');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'platform_setting_type_enum') THEN
    CREATE TYPE platform_setting_type_enum AS ENUM ('string', 'integer', 'decimal', 'boolean', 'json');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'reveal_execution_status_enum') THEN
    CREATE TYPE reveal_execution_status_enum AS ENUM (
      'initiated', 'in_progress', 'completed', 'failed', 'rolled_back'
    );
  END IF;
END
$$;

-- ============================================================
-- Helper Functions / Triggers
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.prevent_update_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Operation not allowed on append-only table %', TG_TABLE_NAME;
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_no_self_vote()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  submission_owner UUID;
BEGIN
  SELECT submitted_by INTO submission_owner
  FROM public.submissions
  WHERE id = NEW.submission_id;

  IF submission_owner IS NULL THEN
    RAISE EXCEPTION 'submission_id % not found', NEW.submission_id;
  END IF;

  IF submission_owner = NEW.voter_id THEN
    RAISE EXCEPTION 'self voting is not allowed';
  END IF;

  RETURN NEW;
END;
$$;

-- ============================================================
-- 1. USERS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMPTZ NULL,
  password_hash VARCHAR(255) NULL,
  role user_role_enum NOT NULL,
  full_name VARCHAR(150) NULL,
  avatar_url VARCHAR(500) NULL,
  country VARCHAR(100) NULL,
  bio TEXT NULL,
  linkedin_url VARCHAR(500) NULL,
  portfolio_url VARCHAR(500) NULL,
  oauth_provider oauth_provider_enum NULL,
  oauth_provider_id VARCHAR(255) NULL,
  is_active BOOLEAN DEFAULT TRUE,
  is_banned BOOLEAN DEFAULT FALSE,
  ban_reason TEXT NULL,
  last_login_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users (username);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users (role);
CREATE INDEX IF NOT EXISTS idx_users_oauth ON public.users (oauth_provider, oauth_provider_id);
CREATE INDEX IF NOT EXISTS idx_users_active ON public.users (is_active) WHERE deleted_at IS NULL;

-- ============================================================
-- 2. USER_SESSIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  refresh_token_hash VARCHAR(255) NOT NULL UNIQUE,
  access_token_jti VARCHAR(255) NOT NULL,
  ip_address INET NULL,
  user_agent TEXT NULL,
  device_fingerprint VARCHAR(255) NULL,
  is_revoked BOOLEAN DEFAULT FALSE,
  revoked_at TIMESTAMPTZ NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.user_sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_refresh_token ON public.user_sessions (refresh_token_hash);
CREATE INDEX IF NOT EXISTS idx_sessions_jti ON public.user_sessions (access_token_jti);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON public.user_sessions (expires_at);

-- ============================================================
-- 3. CONTRIBUTOR_PROFILES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.contributor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  primary_discipline VARCHAR(100) NULL,
  disciplines TEXT[] DEFAULT '{}'::TEXT[],
  skills TEXT[] DEFAULT '{}'::TEXT[],
  experience_level experience_level_enum NULL,
  total_earnings_paise BIGINT DEFAULT 0,
  challenges_entered INTEGER DEFAULT 0,
  challenges_won INTEGER DEFAULT 0,
  top_three_finishes INTEGER DEFAULT 0,
  avg_pss_score DECIMAL(6,2) DEFAULT 0.00,
  avg_oss_score DECIMAL(6,2) DEFAULT 0.00,
  avg_cis_score DECIMAL(6,2) DEFAULT 0.00,
  avg_cvs_score DECIMAL(6,2) DEFAULT 0.00,
  reputation_score DECIMAL(8,2) DEFAULT 0.00,
  profile_public BOOLEAN DEFAULT TRUE,
  show_earnings BOOLEAN DEFAULT TRUE,
  recruiter_api_access BOOLEAN DEFAULT FALSE,
  show_ipar_records BOOLEAN DEFAULT TRUE,
  is_premium BOOLEAN DEFAULT FALSE,
  premium_expires_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contrib_profiles_user_id ON public.contributor_profiles (user_id);
CREATE INDEX IF NOT EXISTS idx_contrib_profiles_discipline ON public.contributor_profiles (primary_discipline);
CREATE INDEX IF NOT EXISTS idx_contrib_profiles_skills ON public.contributor_profiles USING GIN (skills);
CREATE INDEX IF NOT EXISTS idx_contrib_profiles_reputation ON public.contributor_profiles (reputation_score DESC);
CREATE INDEX IF NOT EXISTS idx_contrib_profiles_earnings ON public.contributor_profiles (total_earnings_paise DESC);

-- ============================================================
-- 4. POSTER_PROFILES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.poster_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  organisation_name VARCHAR(255) NOT NULL,
  organisation_type organisation_type_enum NULL,
  industry VARCHAR(150) NULL,
  team_size team_size_enum NULL,
  website_url VARCHAR(500) NULL,
  logo_url VARCHAR(500) NULL,
  description TEXT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ NULL,
  verification_document_url VARCHAR(500) NULL,
  subscription_tier subscription_tier_enum DEFAULT 'starter',
  subscription_expires_at TIMESTAMPTZ NULL,
  total_prize_posted_paise BIGINT DEFAULT 0,
  total_challenges_posted INTEGER DEFAULT 0,
  avg_rating DECIMAL(3,2) DEFAULT 0.00,
  rating_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_poster_profiles_user_id ON public.poster_profiles (user_id);
CREATE INDEX IF NOT EXISTS idx_poster_profiles_org_name ON public.poster_profiles (organisation_name);
CREATE INDEX IF NOT EXISTS idx_poster_profiles_verified ON public.poster_profiles (is_verified);
CREATE INDEX IF NOT EXISTS idx_poster_profiles_tier ON public.poster_profiles (subscription_tier);

-- ============================================================
-- 5. CHALLENGES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poster_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(550) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  deliverables TEXT NULL,
  category VARCHAR(100) NOT NULL,
  image_url VARCHAR(500) NULL,
  sub_tags TEXT[] DEFAULT '{}'::TEXT[],
  target_disciplines TEXT[] DEFAULT '{}'::TEXT[],
  complexity_level complexity_level_enum NULL,
  status challenge_status_enum NOT NULL DEFAULT 'draft',
  prize_pool_paise BIGINT NOT NULL,
  platform_fee_paise BIGINT NOT NULL,
  contributor_pool_paise BIGINT NOT NULL,
  min_submissions INTEGER DEFAULT 1,
  phase1_start_at TIMESTAMPTZ NULL,
  phase1_end_at TIMESTAMPTZ NULL,
  phase2_start_at TIMESTAMPTZ NULL,
  phase2_end_at TIMESTAMPTZ NULL,
  phase3_start_at TIMESTAMPTZ NULL,
  phase3_end_at TIMESTAMPTZ NULL,
  phase4_start_at TIMESTAMPTZ NULL,
  phase4_end_at TIMESTAMPTZ NULL,
  reveal_executed_at TIMESTAMPTZ NULL,
  current_phase INTEGER DEFAULT 1,
  submission_count INTEGER DEFAULT 0,
  participant_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  allow_team_submissions BOOLEAN DEFAULT TRUE,
  max_team_size INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  CONSTRAINT chk_challenges_pool_math CHECK (contributor_pool_paise = prize_pool_paise - platform_fee_paise),
  CONSTRAINT chk_challenges_phase CHECK (current_phase BETWEEN 1 AND 4)
);

ALTER TABLE public.challenges
  ADD COLUMN IF NOT EXISTS image_url VARCHAR(500) NULL;

CREATE INDEX IF NOT EXISTS idx_challenges_poster_id ON public.challenges (poster_id);
CREATE INDEX IF NOT EXISTS idx_challenges_status ON public.challenges (status);
CREATE INDEX IF NOT EXISTS idx_challenges_category ON public.challenges (category);
CREATE INDEX IF NOT EXISTS idx_challenges_sub_tags ON public.challenges USING GIN (sub_tags);
CREATE INDEX IF NOT EXISTS idx_challenges_phase2_end ON public.challenges (phase2_end_at);
CREATE INDEX IF NOT EXISTS idx_challenges_featured ON public.challenges (is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_challenges_slug ON public.challenges (slug);
CREATE INDEX IF NOT EXISTS idx_challenges_created ON public.challenges (created_at DESC);

-- ============================================================
-- 6. CHALLENGE_EVALUATION_CRITERIA
-- ============================================================

CREATE TABLE IF NOT EXISTS public.challenge_evaluation_criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  criterion_name VARCHAR(200) NOT NULL,
  description TEXT NULL,
  weight_percent DECIMAL(5,2) NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_criteria_challenge_name UNIQUE (challenge_id, criterion_name)
);

CREATE INDEX IF NOT EXISTS idx_eval_criteria_challenge ON public.challenge_evaluation_criteria (challenge_id);
CREATE INDEX IF NOT EXISTS idx_eval_criteria_sort ON public.challenge_evaluation_criteria (challenge_id, sort_order);

-- ============================================================
-- 7. CHALLENGE_WATCHERS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.challenge_watchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_watcher UNIQUE (challenge_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_watchers_challenge ON public.challenge_watchers (challenge_id);
CREATE INDEX IF NOT EXISTS idx_watchers_user ON public.challenge_watchers (user_id);

-- ============================================================
-- 8. CHALLENGE_CLARIFICATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.challenge_clarifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  asked_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  answer TEXT NULL,
  answered_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  answered_at TIMESTAMPTZ NULL,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clarifications_challenge ON public.challenge_clarifications (challenge_id);
CREATE INDEX IF NOT EXISTS idx_clarifications_asked_by ON public.challenge_clarifications (asked_by);

-- ============================================================
-- 9. ESCROW_ACCOUNTS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.escrow_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL UNIQUE REFERENCES public.challenges(id) ON DELETE RESTRICT,
  poster_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  total_amount_paise BIGINT NOT NULL,
  platform_fee_paise BIGINT NOT NULL,
  contributor_pool_paise BIGINT NOT NULL,
  status escrow_status_enum NOT NULL DEFAULT 'pending',
  deposit_confirmed_at TIMESTAMPTZ NULL,
  fully_released_at TIMESTAMPTZ NULL,
  refunded_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT chk_escrow_pool_math CHECK (contributor_pool_paise = total_amount_paise - platform_fee_paise)
);

CREATE INDEX IF NOT EXISTS idx_escrow_challenge_id ON public.escrow_accounts (challenge_id);
CREATE INDEX IF NOT EXISTS idx_escrow_poster_id ON public.escrow_accounts (poster_id);
CREATE INDEX IF NOT EXISTS idx_escrow_status ON public.escrow_accounts (status);

-- ============================================================
-- 10. ESCROW_TRANSACTIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.escrow_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  escrow_account_id UUID NOT NULL REFERENCES public.escrow_accounts(id),
  transaction_type escrow_transaction_type_enum NOT NULL,
  amount_paise BIGINT NOT NULL,
  recipient_user_id UUID NULL REFERENCES public.users(id),
  payment_gateway VARCHAR(100) NULL,
  gateway_transaction_id VARCHAR(255) NULL,
  gateway_reference VARCHAR(255) NULL,
  status escrow_transaction_status_enum NOT NULL DEFAULT 'initiated',
  initiated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ NULL,
  failure_reason TEXT NULL,
  metadata JSONB NULL
);

CREATE INDEX IF NOT EXISTS idx_escrow_txn_account_id ON public.escrow_transactions (escrow_account_id);
CREATE INDEX IF NOT EXISTS idx_escrow_txn_recipient ON public.escrow_transactions (recipient_user_id);
CREATE INDEX IF NOT EXISTS idx_escrow_txn_status ON public.escrow_transactions (status);
CREATE INDEX IF NOT EXISTS idx_escrow_txn_gateway_id ON public.escrow_transactions (gateway_transaction_id);

-- ============================================================
-- 12. SUBMISSION_ENCRYPTION_KEYS (created before submissions)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.submission_encryption_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NULL,
  encrypted_key_blob BYTEA NOT NULL,
  master_key_version VARCHAR(50) NOT NULL,
  key_algorithm VARCHAR(50) NOT NULL DEFAULT 'AES-256-CBC',
  wrapping_algorithm VARCHAR(50) NOT NULL DEFAULT 'RSA-OAEP-SHA256',
  is_released BOOLEAN DEFAULT FALSE,
  released_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_enc_keys_submission_id ON public.submission_encryption_keys (submission_id);
CREATE INDEX IF NOT EXISTS idx_enc_keys_released ON public.submission_encryption_keys (is_released);

-- ============================================================
-- 14. SUBMISSION_TEAMS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.submission_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id),
  team_name VARCHAR(200) NULL,
  lead_user_id UUID NOT NULL REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.submission_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.submission_teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  contribution_weight DECIMAL(5,2) NOT NULL DEFAULT 1.00,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_team_member UNIQUE (team_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON public.submission_team_members (team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON public.submission_team_members (user_id);

-- ============================================================
-- 11. SUBMISSIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE RESTRICT,
  submitted_by UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  team_id UUID NULL REFERENCES public.submission_teams(id),
  title VARCHAR(500) NOT NULL,
  content_ciphertext BYTEA NOT NULL,
  content_iv BYTEA NOT NULL,
  encrypted_key_id UUID NOT NULL REFERENCES public.submission_encryption_keys(id),
  content_hash_sha256 VARCHAR(64) NOT NULL,
  content_plaintext TEXT NULL,
  attachment_count INTEGER DEFAULT 0,
  status submission_status_enum NOT NULL DEFAULT 'sealed',
  attribution_type attribution_type_enum NOT NULL DEFAULT 'original',
  parent_submission_ids UUID[] DEFAULT '{}'::UUID[],
  oss_score DECIMAL(6,2) NULL,
  cis_score DECIMAL(6,2) NULL,
  cvs_score DECIMAL(6,2) NULL,
  cjs_score DECIMAL(6,2) NULL,
  otb_score DECIMAL(6,2) NULL,
  pss_total DECIMAL(6,2) NULL,
  psa_amount_paise BIGINT NULL,
  is_on_time BOOLEAN NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revealed_at TIMESTAMPTZ NULL,
  fork_count INTEGER DEFAULT 0,
  merge_count INTEGER DEFAULT 0,
  credit_count INTEGER DEFAULT 0,
  vote_score DECIMAL(8,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

CREATE INDEX IF NOT EXISTS idx_submissions_challenge ON public.submissions (challenge_id);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_by ON public.submissions (submitted_by);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.submissions (status);
CREATE INDEX IF NOT EXISTS idx_submissions_hash ON public.submissions (content_hash_sha256);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON public.submissions (challenge_id, submitted_at);
CREATE INDEX IF NOT EXISTS idx_submissions_pss ON public.submissions (pss_total DESC) WHERE pss_total IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_submissions_attribution ON public.submissions (attribution_type);

ALTER TABLE public.submission_encryption_keys
  DROP CONSTRAINT IF EXISTS fk_enc_key_submission;

ALTER TABLE public.submission_encryption_keys
  ADD CONSTRAINT fk_enc_key_submission
  FOREIGN KEY (submission_id) REFERENCES public.submissions(id) ON DELETE CASCADE;

-- ============================================================
-- 13. SUBMISSION_ATTACHMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.submission_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  original_filename VARCHAR(500) NOT NULL,
  stored_filename VARCHAR(500) NOT NULL,
  file_path VARCHAR(1000) NOT NULL,
  mime_type VARCHAR(200) NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  file_hash_sha256 VARCHAR(64) NOT NULL,
  is_encrypted BOOLEAN DEFAULT TRUE,
  encryption_key_id UUID NULL REFERENCES public.submission_encryption_keys(id),
  is_visible BOOLEAN DEFAULT FALSE,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attachments_submission ON public.submission_attachments (submission_id);
CREATE INDEX IF NOT EXISTS idx_attachments_visible ON public.submission_attachments (is_visible);

-- ============================================================
-- 15. IP_ATTRIBUTION_RECORDS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.ip_attribution_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE RESTRICT,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE RESTRICT,
  contributor_id_hash VARCHAR(64) NOT NULL,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  submission_hash_sha256 VARCHAR(64) NOT NULL,
  receipt_timestamp_unix_ms BIGINT NOT NULL,
  receipt_timestamp TIMESTAMPTZ NOT NULL,
  attribution_type attribution_type_enum NOT NULL,
  ipar_schema_version INTEGER NOT NULL DEFAULT 1,
  platform_signature TEXT NOT NULL,
  signing_key_version VARCHAR(50) NOT NULL,
  is_verified BOOLEAN DEFAULT TRUE,
  backup_replicated_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ipar_submission_id ON public.ip_attribution_records (submission_id);
CREATE INDEX IF NOT EXISTS idx_ipar_user_id ON public.ip_attribution_records (user_id);
CREATE INDEX IF NOT EXISTS idx_ipar_challenge_id ON public.ip_attribution_records (challenge_id);
CREATE INDEX IF NOT EXISTS idx_ipar_contributor_hash ON public.ip_attribution_records (contributor_id_hash);
CREATE INDEX IF NOT EXISTS idx_ipar_hash ON public.ip_attribution_records (submission_hash_sha256);
CREATE INDEX IF NOT EXISTS idx_ipar_timestamp ON public.ip_attribution_records (receipt_timestamp);

DROP TRIGGER IF EXISTS trg_no_update_ipar ON public.ip_attribution_records;
DROP TRIGGER IF EXISTS trg_no_delete_ipar ON public.ip_attribution_records;

CREATE TRIGGER trg_no_update_ipar
  BEFORE UPDATE ON public.ip_attribution_records
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_update_delete();

CREATE TRIGGER trg_no_delete_ipar
  BEFORE DELETE ON public.ip_attribution_records
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_update_delete();

-- ============================================================
-- 16. COLLABORATION_GRAPH_EDGES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.collaboration_graph_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  source_submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  target_submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  edge_type collaboration_edge_type_enum NOT NULL,
  influence_weight DECIMAL(5,2) NULL,
  annotation_text TEXT NULL,
  annotation_type annotation_type_enum NULL,
  recorded_by UUID NOT NULL REFERENCES public.users(id),
  is_accepted BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT no_self_loop CHECK (source_submission_id <> target_submission_id)
);

CREATE INDEX IF NOT EXISTS idx_dag_edges_challenge ON public.collaboration_graph_edges (challenge_id);
CREATE INDEX IF NOT EXISTS idx_dag_edges_source ON public.collaboration_graph_edges (source_submission_id);
CREATE INDEX IF NOT EXISTS idx_dag_edges_target ON public.collaboration_graph_edges (target_submission_id);
CREATE INDEX IF NOT EXISTS idx_dag_edges_type ON public.collaboration_graph_edges (edge_type);
CREATE INDEX IF NOT EXISTS idx_dag_edges_challenge_type ON public.collaboration_graph_edges (challenge_id, edge_type);
CREATE INDEX IF NOT EXISTS idx_dag_edges_recorded_by ON public.collaboration_graph_edges (recorded_by);

-- ============================================================
-- 17. CIS_COMPUTATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.cis_computations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id),
  submission_id UUID NOT NULL REFERENCES public.submissions(id),
  user_id UUID NOT NULL REFERENCES public.users(id),
  n_influenced INTEGER NOT NULL,
  n_total_interactions INTEGER NOT NULL,
  cis_score DECIMAL(6,2) NOT NULL,
  computation_version INTEGER NOT NULL DEFAULT 1,
  computed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cis_challenge_id ON public.cis_computations (challenge_id);
CREATE INDEX IF NOT EXISTS idx_cis_submission_id ON public.cis_computations (submission_id);
CREATE INDEX IF NOT EXISTS idx_cis_user_id ON public.cis_computations (user_id);
CREATE INDEX IF NOT EXISTS idx_cis_computed_at ON public.cis_computations (challenge_id, computed_at DESC);

-- ============================================================
-- 18. COMMUNITY_VOTES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.community_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  voter_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  rank_position INTEGER NOT NULL,
  vote_weight DECIMAL(5,4) NOT NULL,
  is_excluded BOOLEAN DEFAULT FALSE,
  exclusion_reason VARCHAR(200) NULL,
  voted_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_vote UNIQUE (challenge_id, voter_id, submission_id)
);

CREATE INDEX IF NOT EXISTS idx_votes_challenge ON public.community_votes (challenge_id);
CREATE INDEX IF NOT EXISTS idx_votes_voter_id ON public.community_votes (voter_id);
CREATE INDEX IF NOT EXISTS idx_votes_submission_id ON public.community_votes (submission_id);
CREATE INDEX IF NOT EXISTS idx_votes_excluded ON public.community_votes (is_excluded) WHERE is_excluded = FALSE;

DROP TRIGGER IF EXISTS trg_no_self_vote ON public.community_votes;
CREATE TRIGGER trg_no_self_vote
  BEFORE INSERT OR UPDATE ON public.community_votes
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_no_self_vote();

-- ============================================================
-- 19. JUDGE_SCORES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.judge_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  judge_user_id UUID NOT NULL REFERENCES public.users(id),
  score_type judge_score_type_enum NOT NULL,
  criterion_id UUID NULL REFERENCES public.challenge_evaluation_criteria(id),
  raw_score DECIMAL(5,2) NOT NULL,
  normalised_score DECIMAL(6,2) NULL,
  written_comment TEXT NULL,
  scored_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_judge_score UNIQUE (submission_id, judge_user_id, score_type, criterion_id)
);

CREATE INDEX IF NOT EXISTS idx_judge_scores_challenge ON public.judge_scores (challenge_id);
CREATE INDEX IF NOT EXISTS idx_judge_scores_submission ON public.judge_scores (submission_id);
CREATE INDEX IF NOT EXISTS idx_judge_scores_judge ON public.judge_scores (judge_user_id);
CREATE INDEX IF NOT EXISTS idx_judge_scores_type ON public.judge_scores (score_type);

-- ============================================================
-- 20. CHALLENGE_JUDGES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.challenge_judges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  judge_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  assigned_by UUID NOT NULL REFERENCES public.users(id),
  is_external BOOLEAN DEFAULT FALSE,
  external_name VARCHAR(200) NULL,
  external_email VARCHAR(255) NULL,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_judge UNIQUE (challenge_id, judge_user_id)
);

CREATE INDEX IF NOT EXISTS idx_judges_challenge ON public.challenge_judges (challenge_id);
CREATE INDEX IF NOT EXISTS idx_judges_user_id ON public.challenge_judges (judge_user_id);

-- ============================================================
-- 21. PSS_COMPUTATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.pss_computations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id),
  submission_id UUID NOT NULL REFERENCES public.submissions(id),
  user_id UUID NOT NULL REFERENCES public.users(id),
  oss_score DECIMAL(6,2) NOT NULL,
  cis_score DECIMAL(6,2) NOT NULL,
  cvs_score DECIMAL(6,2) NOT NULL,
  cjs_score DECIMAL(6,2) NOT NULL,
  otb_score DECIMAL(6,2) NOT NULL,
  pss_total DECIMAL(6,2) NOT NULL,
  pss_rank INTEGER NOT NULL,
  psa_amount_paise BIGINT NOT NULL,
  is_final BOOLEAN DEFAULT FALSE,
  finalised_at TIMESTAMPTZ NULL,
  computed_at TIMESTAMPTZ DEFAULT NOW(),
  computation_version INTEGER DEFAULT 1,
  CONSTRAINT uq_pss_final UNIQUE (challenge_id, submission_id, computation_version)
);

CREATE INDEX IF NOT EXISTS idx_pss_challenge_id ON public.pss_computations (challenge_id);
CREATE INDEX IF NOT EXISTS idx_pss_submission_id ON public.pss_computations (submission_id);
CREATE INDEX IF NOT EXISTS idx_pss_user_id ON public.pss_computations (user_id);
CREATE INDEX IF NOT EXISTS idx_pss_final ON public.pss_computations (challenge_id, is_final);
CREATE INDEX IF NOT EXISTS idx_pss_rank ON public.pss_computations (challenge_id, pss_rank);

-- ============================================================
-- 22. PRIZE_DISBURSEMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.prize_disbursements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id),
  pss_computation_id UUID NOT NULL REFERENCES public.pss_computations(id),
  escrow_transaction_id UUID NOT NULL REFERENCES public.escrow_transactions(id),
  recipient_user_id UUID NOT NULL REFERENCES public.users(id),
  amount_paise BIGINT NOT NULL,
  pss_score DECIMAL(6,2) NOT NULL,
  pss_rank INTEGER NOT NULL,
  status prize_disbursement_status_enum NOT NULL DEFAULT 'pending',
  payment_method VARCHAR(100) NULL,
  payment_reference VARCHAR(255) NULL,
  disbursed_at TIMESTAMPTZ NULL,
  failure_reason TEXT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_disbursements_challenge ON public.prize_disbursements (challenge_id);
CREATE INDEX IF NOT EXISTS idx_disbursements_recipient ON public.prize_disbursements (recipient_user_id);
CREATE INDEX IF NOT EXISTS idx_disbursements_status ON public.prize_disbursements (status);
CREATE INDEX IF NOT EXISTS idx_disbursements_escrow_txn ON public.prize_disbursements (escrow_transaction_id);

-- ============================================================
-- 23. CONTRIBUTOR_BANK_ACCOUNTS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.contributor_bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  account_holder_name VARCHAR(255) NOT NULL,
  account_type bank_account_type_enum NOT NULL,
  account_number_hash VARCHAR(64) NULL,
  account_number_last4 VARCHAR(4) NULL,
  ifsc_code VARCHAR(20) NULL,
  upi_id VARCHAR(255) NULL,
  bank_name VARCHAR(200) NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bank_accounts_user_id ON public.contributor_bank_accounts (user_id);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_primary ON public.contributor_bank_accounts (user_id, is_primary) WHERE is_primary = TRUE;

-- ============================================================
-- 24. REPUTATION_PROFILES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.reputation_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id),
  total_pss_accumulated DECIMAL(10,2) DEFAULT 0.00,
  total_earnings_paise BIGINT DEFAULT 0,
  challenges_entered INTEGER DEFAULT 0,
  challenges_with_award INTEGER DEFAULT 0,
  rank_1_count INTEGER DEFAULT 0,
  top_3_count INTEGER DEFAULT 0,
  top_10_count INTEGER DEFAULT 0,
  avg_oss_score DECIMAL(6,2) DEFAULT 0.00,
  avg_cis_score DECIMAL(6,2) DEFAULT 0.00,
  avg_cvs_score DECIMAL(6,2) DEFAULT 0.00,
  avg_cjs_score DECIMAL(6,2) DEFAULT 0.00,
  avg_otb_rate DECIMAL(5,2) DEFAULT 0.00,
  discipline_breakdown JSONB DEFAULT '{}'::JSONB,
  win_rate_percent DECIMAL(5,2) DEFAULT 0.00,
  composite_reputation_score DECIMAL(8,2) DEFAULT 0.00,
  global_rank INTEGER NULL,
  discipline_rank JSONB DEFAULT '{}'::JSONB,
  last_computed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reputation_user_id ON public.reputation_profiles (user_id);
CREATE INDEX IF NOT EXISTS idx_reputation_composite ON public.reputation_profiles (composite_reputation_score DESC);
CREATE INDEX IF NOT EXISTS idx_reputation_global_rank ON public.reputation_profiles (global_rank);
CREATE INDEX IF NOT EXISTS idx_reputation_discipline ON public.reputation_profiles USING GIN (discipline_breakdown);

-- ============================================================
-- 25. SKILL_ENDORSEMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.skill_endorsements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contributor_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  endorser_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  challenge_id UUID NULL REFERENCES public.challenges(id),
  skill_name VARCHAR(150) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_endorsement UNIQUE (contributor_user_id, endorser_user_id, skill_name, challenge_id)
);

CREATE INDEX IF NOT EXISTS idx_endorsements_contributor ON public.skill_endorsements (contributor_user_id);
CREATE INDEX IF NOT EXISTS idx_endorsements_skill ON public.skill_endorsements (skill_name);

-- ============================================================
-- 26. RECRUITER_API_ACCESS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.recruiter_api_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  api_key_hash VARCHAR(64) NOT NULL UNIQUE,
  api_key_prefix VARCHAR(12) NOT NULL,
  subscription_tier recruiter_tier_enum DEFAULT 'basic',
  monthly_request_limit INTEGER DEFAULT 1000,
  requests_this_month INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS public.recruiter_api_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID NOT NULL REFERENCES public.recruiter_api_access(id),
  endpoint VARCHAR(500) NOT NULL,
  target_user_id UUID NULL REFERENCES public.users(id),
  response_code INTEGER NOT NULL,
  requested_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recruiter_api_key_hash ON public.recruiter_api_access (api_key_hash);
CREATE INDEX IF NOT EXISTS idx_recruiter_requests_key ON public.recruiter_api_requests (api_key_id, requested_at DESC);

-- ============================================================
-- 27. NOTIFICATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type notification_type_enum NOT NULL,
  title VARCHAR(500) NOT NULL,
  body TEXT NOT NULL,
  related_entity_type related_entity_type_enum NULL,
  related_entity_id UUID NULL,
  action_url VARCHAR(500) NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications (user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications (type);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications (created_at DESC);

-- ============================================================
-- 28. AUDIT_LOGS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID NULL REFERENCES public.users(id),
  action VARCHAR(200) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID NOT NULL,
  ip_address INET NULL,
  user_agent TEXT NULL,
  old_state JSONB NULL,
  new_state JSONB NULL,
  metadata JSONB NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_actor ON public.audit_logs (actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON public.audit_logs (action);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON public.audit_logs (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON public.audit_logs (created_at DESC);

DROP TRIGGER IF EXISTS trg_no_update_audit_logs ON public.audit_logs;
DROP TRIGGER IF EXISTS trg_no_delete_audit_logs ON public.audit_logs;

CREATE TRIGGER trg_no_update_audit_logs
  BEFORE UPDATE ON public.audit_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_update_delete();

CREATE TRIGGER trg_no_delete_audit_logs
  BEFORE DELETE ON public.audit_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_update_delete();

-- ============================================================
-- 29. PLATFORM_SETTINGS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(200) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  value_type platform_setting_type_enum NOT NULL,
  description TEXT NULL,
  is_sensitive BOOLEAN DEFAULT FALSE,
  updated_by UUID NULL REFERENCES public.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 30. REVEAL_EXECUTION_LOG
-- ============================================================

CREATE TABLE IF NOT EXISTS public.reveal_execution_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id),
  triggered_at TIMESTAMPTZ NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ NULL,
  status reveal_execution_status_enum NOT NULL,
  submissions_decrypted INTEGER DEFAULT 0,
  submissions_failed INTEGER DEFAULT 0,
  transaction_id VARCHAR(255) NULL,
  error_message TEXT NULL,
  execution_duration_ms INTEGER NULL
);

CREATE INDEX IF NOT EXISTS idx_reveal_log_challenge ON public.reveal_execution_logs (challenge_id);
CREATE INDEX IF NOT EXISTS idx_reveal_log_status ON public.reveal_execution_logs (status);
CREATE INDEX IF NOT EXISTS idx_reveal_log_triggered ON public.reveal_execution_logs (triggered_at);

-- ============================================================
-- updated_at triggers
-- ============================================================

DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_contributor_profiles_updated_at ON public.contributor_profiles;
CREATE TRIGGER trg_contributor_profiles_updated_at
  BEFORE UPDATE ON public.contributor_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_poster_profiles_updated_at ON public.poster_profiles;
CREATE TRIGGER trg_poster_profiles_updated_at
  BEFORE UPDATE ON public.poster_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_challenges_updated_at ON public.challenges;
CREATE TRIGGER trg_challenges_updated_at
  BEFORE UPDATE ON public.challenges
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_challenge_clarifications_updated_at ON public.challenge_clarifications;
CREATE TRIGGER trg_challenge_clarifications_updated_at
  BEFORE UPDATE ON public.challenge_clarifications
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_escrow_accounts_updated_at ON public.escrow_accounts;
CREATE TRIGGER trg_escrow_accounts_updated_at
  BEFORE UPDATE ON public.escrow_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_submissions_updated_at ON public.submissions;
CREATE TRIGGER trg_submissions_updated_at
  BEFORE UPDATE ON public.submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_bank_accounts_updated_at ON public.contributor_bank_accounts;
CREATE TRIGGER trg_bank_accounts_updated_at
  BEFORE UPDATE ON public.contributor_bank_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_reputation_profiles_updated_at ON public.reputation_profiles;
CREATE TRIGGER trg_reputation_profiles_updated_at
  BEFORE UPDATE ON public.reputation_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

COMMIT;
