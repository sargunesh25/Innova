-- ============================================================
-- INNOVA - Dummy Seed Data
-- Run after schema.sql
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- USERS
-- ------------------------------------------------------------
INSERT INTO public.users (
  id, username, email, email_verified, email_verified_at, password_hash, role,
  full_name, country, bio, linkedin_url, portfolio_url,
  oauth_provider, oauth_provider_id, is_active, is_banned, last_login_at
)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin_riya', 'riya.admin@innova.test', TRUE, NOW(), '$2b$10$dummyhash1', 'admin', 'Riya Sharma', 'India', 'Platform administrator', NULL, NULL, NULL, NULL, TRUE, FALSE, NOW()),
  ('22222222-2222-2222-2222-222222222222', 'poster_zenith', 'ops@zenithlabs.test', TRUE, NOW(), '$2b$10$dummyhash2', 'poster', 'Arjun Mehta', 'India', 'Innovation lead at Zenith Labs', 'https://linkedin.com/in/arjunmehta', 'https://zenithlabs.test', NULL, NULL, TRUE, FALSE, NOW()),
  ('33333333-3333-3333-3333-333333333333', 'poster_novus', 'team@novussystems.test', TRUE, NOW(), '$2b$10$dummyhash3', 'poster', 'Ira Nair', 'India', 'Product strategy head', 'https://linkedin.com/in/iranair', 'https://novussystems.test', NULL, NULL, TRUE, FALSE, NOW()),
  ('44444444-4444-4444-4444-444444444444', 'contrib_adi', 'adi@innovators.test', TRUE, NOW(), '$2b$10$dummyhash4', 'contributor', 'Aditya Rao', 'India', 'Systems engineer and rapid prototyper', 'https://linkedin.com/in/adityarao', 'https://adityarao.dev', 'google', 'google-adi-001', TRUE, FALSE, NOW()),
  ('55555555-5555-5555-5555-555555555555', 'contrib_mira', 'mira@innovators.test', TRUE, NOW(), '$2b$10$dummyhash5', 'contributor', 'Mira Kapoor', 'India', 'Product designer focused on climate tech', 'https://linkedin.com/in/mirakapoor', 'https://mira.design', 'linkedin', 'li-mira-001', TRUE, FALSE, NOW()),
  ('66666666-6666-6666-6666-666666666666', 'contrib_kabir', 'kabir@innovators.test', FALSE, NULL, '$2b$10$dummyhash6', 'contributor', 'Kabir Iyer', 'India', 'Applied AI researcher', NULL, 'https://kabir-ai.test', NULL, NULL, TRUE, FALSE, NOW())
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- USER_SESSIONS
-- ------------------------------------------------------------
INSERT INTO public.user_sessions (
  id, user_id, refresh_token_hash, access_token_jti, ip_address, user_agent,
  device_fingerprint, is_revoked, revoked_at, expires_at
)
VALUES
  ('70000000-0000-0000-0000-000000000001', '44444444-4444-4444-4444-444444444444', 'rt_hash_adi_1', 'jti-adi-1', '103.21.244.1', 'Mozilla/5.0', 'fp-adi-1', FALSE, NULL, NOW() + INTERVAL '14 days'),
  ('70000000-0000-0000-0000-000000000002', '55555555-5555-5555-5555-555555555555', 'rt_hash_mira_1', 'jti-mira-1', '103.21.244.2', 'Mozilla/5.0', 'fp-mira-1', FALSE, NULL, NOW() + INTERVAL '14 days')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- CONTRIBUTOR_PROFILES
-- ------------------------------------------------------------
INSERT INTO public.contributor_profiles (
  id, user_id, primary_discipline, disciplines, skills, experience_level,
  total_earnings_paise, challenges_entered, challenges_won, top_three_finishes,
  avg_pss_score, avg_oss_score, avg_cis_score, avg_cvs_score, reputation_score,
  profile_public, show_earnings, recruiter_api_access, show_ipar_records,
  is_premium, premium_expires_at
)
VALUES
  ('71000000-0000-0000-0000-000000000001', '44444444-4444-4444-4444-444444444444', 'Engineering', ARRAY['Engineering', 'Research'], ARRAY['Python', 'Systems Design', 'ML Ops'], 'Expert', 1850000, 12, 3, 6, 82.50, 84.10, 79.80, 80.30, 88.70, TRUE, TRUE, TRUE, TRUE, TRUE, NOW() + INTERVAL '1 year'),
  ('71000000-0000-0000-0000-000000000002', '55555555-5555-5555-5555-555555555555', 'Design', ARRAY['Design', 'Marketing'], ARRAY['Figma', 'Service Design', 'UX Research'], 'Intermediate', 730000, 9, 1, 4, 74.20, 70.00, 72.30, 78.20, 76.40, TRUE, TRUE, FALSE, TRUE, FALSE, NULL),
  ('71000000-0000-0000-0000-000000000003', '66666666-6666-6666-6666-666666666666', 'Research', ARRAY['Research', 'Engineering'], ARRAY['NLP', 'Causal Inference'], 'Expert', 420000, 4, 0, 1, 68.10, 66.20, 71.00, 64.40, 69.00, TRUE, FALSE, FALSE, TRUE, FALSE, NULL)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- POSTER_PROFILES
-- ------------------------------------------------------------
INSERT INTO public.poster_profiles (
  id, user_id, organisation_name, organisation_type, industry, team_size,
  website_url, logo_url, description, is_verified, verified_at,
  verification_document_url, subscription_tier, subscription_expires_at,
  total_prize_posted_paise, total_challenges_posted, avg_rating, rating_count
)
VALUES
  ('72000000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'Zenith Labs', 'Startup', 'Deep Tech', '11-50', 'https://zenithlabs.test', 'https://cdn.test/zenith-logo.png', 'Applied R&D for industrial innovation', TRUE, NOW() - INTERVAL '4 months', 'https://cdn.test/docs/zenith-kyb.pdf', 'growth', NOW() + INTERVAL '8 months', 2500000, 5, 4.60, 41),
  ('72000000-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'Novus Systems', 'Corporation', 'Enterprise Software', '201-1000', 'https://novussystems.test', 'https://cdn.test/novus-logo.png', 'Enterprise transformation challenges', TRUE, NOW() - INTERVAL '9 months', 'https://cdn.test/docs/novus-kyb.pdf', 'enterprise', NOW() + INTERVAL '14 months', 4400000, 8, 4.80, 73)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- CHALLENGES
-- ------------------------------------------------------------
INSERT INTO public.challenges (
  id, poster_id, title, slug, description, deliverables, category, image_url, sub_tags,
  target_disciplines, complexity_level, status, prize_pool_paise, platform_fee_paise,
  contributor_pool_paise, min_submissions, phase1_start_at, phase1_end_at,
  phase2_start_at, phase2_end_at, phase3_start_at, phase3_end_at, phase4_start_at,
  phase4_end_at, reveal_executed_at, current_phase, submission_count,
  participant_count, view_count, is_featured, allow_team_submissions, max_team_size
)
VALUES
  (
    '80000000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222',
    'Decarbonised Manufacturing Workflow', 'decarbonised-manufacturing-workflow',
    'Design a practical roadmap to reduce manufacturing emissions by 40%.',
    'Architecture doc, simulation model, rollout plan',
    'Engineering', '/challenge-images/decarbonised-manufacturing.svg', ARRAY['climate', 'manufacturing', 'optimization'],
    ARRAY['Engineering', 'Research', 'Policy'], 'Expert', 'active',
    1200000, 96000, 1104000, 3,
    NOW() - INTERVAL '10 days', NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '1 day', NOW() + INTERVAL '6 days',
    NOW() + INTERVAL '7 days', NOW() + INTERVAL '14 days',
    NOW() + INTERVAL '15 days', NOW() + INTERVAL '20 days',
    NULL, 2, 2, 14, 352, TRUE, TRUE, 5
  ),
  (
    '80000000-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333',
    'Citizen-Centric Service Reimagining', 'citizen-centric-service-reimagining',
    'Improve public service request handling with measurable SLA gains.',
    'Process blueprint, prototype dashboard, pilot KPIs',
    'Policy', '/challenge-images/citizen-service.svg', ARRAY['public-sector', 'service-design'],
    ARRAY['Design', 'Policy', 'Marketing'], 'Intermediate', 'active',
    900000, 72000, 828000, 2,
    NOW() - INTERVAL '14 days', NOW() - INTERVAL '7 days',
    NOW() - INTERVAL '6 days', NOW() + INTERVAL '3 days',
    NOW() + INTERVAL '4 days', NOW() + INTERVAL '11 days',
    NOW() + INTERVAL '12 days', NOW() + INTERVAL '17 days',
    NULL, 2, 1, 10, 221, FALSE, TRUE, 4
)
ON CONFLICT (id) DO NOTHING;

UPDATE public.challenges
SET image_url = CASE
  WHEN id = '80000000-0000-0000-0000-000000000001' THEN '/challenge-images/decarbonised-manufacturing.svg'
  WHEN id = '80000000-0000-0000-0000-000000000002' THEN '/challenge-images/citizen-service.svg'
  WHEN category = 'Engineering' THEN '/challenge-images/engineering-generic.svg'
  WHEN category = 'Research' THEN '/challenge-images/research-generic.svg'
  WHEN category = 'Design' THEN '/challenge-images/design-generic.svg'
  WHEN category = 'Policy' THEN '/challenge-images/citizen-service.svg'
  ELSE '/challenge-images/innovation-generic.svg'
END
WHERE image_url IS NULL OR image_url = '';

-- ------------------------------------------------------------
-- CHALLENGE_EVALUATION_CRITERIA
-- ------------------------------------------------------------
INSERT INTO public.challenge_evaluation_criteria (
  id, challenge_id, criterion_name, description, weight_percent, sort_order
)
VALUES
  ('81000000-0000-0000-0000-000000000001', '80000000-0000-0000-0000-000000000001', 'Technical Feasibility', 'Engineering viability and realism', 35.00, 1),
  ('81000000-0000-0000-0000-000000000002', '80000000-0000-0000-0000-000000000001', 'Impact Potential', 'Emission reduction potential at scale', 30.00, 2),
  ('81000000-0000-0000-0000-000000000003', '80000000-0000-0000-0000-000000000001', 'Execution Plan', 'Roadmap quality and milestones', 35.00, 3),
  ('81000000-0000-0000-0000-000000000004', '80000000-0000-0000-0000-000000000002', 'User Experience', 'Ease of adoption by citizens', 40.00, 1),
  ('81000000-0000-0000-0000-000000000005', '80000000-0000-0000-0000-000000000002', 'Policy Alignment', 'Regulatory and governance fit', 30.00, 2),
  ('81000000-0000-0000-0000-000000000006', '80000000-0000-0000-0000-000000000002', 'Operational Effectiveness', 'SLA and throughput improvement', 30.00, 3)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- CHALLENGE_WATCHERS
-- ------------------------------------------------------------
INSERT INTO public.challenge_watchers (id, challenge_id, user_id)
VALUES
  ('82000000-0000-0000-0000-000000000001', '80000000-0000-0000-0000-000000000001', '44444444-4444-4444-4444-444444444444'),
  ('82000000-0000-0000-0000-000000000002', '80000000-0000-0000-0000-000000000001', '55555555-5555-5555-5555-555555555555'),
  ('82000000-0000-0000-0000-000000000003', '80000000-0000-0000-0000-000000000002', '66666666-6666-6666-6666-666666666666')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- CHALLENGE_CLARIFICATIONS
-- ------------------------------------------------------------
INSERT INTO public.challenge_clarifications (
  id, challenge_id, asked_by, question, answer, answered_by, answered_at, is_public
)
VALUES
  (
    '83000000-0000-0000-0000-000000000001', '80000000-0000-0000-0000-000000000001',
    '44444444-4444-4444-4444-444444444444',
    'Can we assume existing MES integration for pilot rollout?',
    'Yes, assume standard MES integration APIs are available.',
    '22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '6 hours', TRUE
  )
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- ESCROW_ACCOUNTS
-- ------------------------------------------------------------
INSERT INTO public.escrow_accounts (
  id, challenge_id, poster_id, total_amount_paise, platform_fee_paise,
  contributor_pool_paise, status, deposit_confirmed_at
)
VALUES
  (
    '84000000-0000-0000-0000-000000000001', '80000000-0000-0000-0000-000000000001',
    '22222222-2222-2222-2222-222222222222', 1200000, 96000, 1104000,
    'funded', NOW() - INTERVAL '9 days'
  ),
  (
    '84000000-0000-0000-0000-000000000002', '80000000-0000-0000-0000-000000000002',
    '33333333-3333-3333-3333-333333333333', 900000, 72000, 828000,
    'funded', NOW() - INTERVAL '13 days'
  )
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- ESCROW_TRANSACTIONS
-- ------------------------------------------------------------
INSERT INTO public.escrow_transactions (
  id, escrow_account_id, transaction_type, amount_paise, recipient_user_id,
  payment_gateway, gateway_transaction_id, gateway_reference, status,
  initiated_at, completed_at, metadata
)
VALUES
  (
    '85000000-0000-0000-0000-000000000001', '84000000-0000-0000-0000-000000000001',
    'deposit', 1200000, NULL, 'razorpay', 'rzp_txn_001', 'rzp_ref_001',
    'completed', NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days',
    '{"source":"challenge_funding"}'::JSONB
  ),
  (
    '85000000-0000-0000-0000-000000000002', '84000000-0000-0000-0000-000000000002',
    'deposit', 900000, NULL, 'stripe', 'st_txn_001', 'st_ref_001',
    'completed', NOW() - INTERVAL '13 days', NOW() - INTERVAL '13 days',
    '{"source":"challenge_funding"}'::JSONB
  )
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- SUBMISSION_ENCRYPTION_KEYS
-- ------------------------------------------------------------
INSERT INTO public.submission_encryption_keys (
  id, submission_id, encrypted_key_blob, master_key_version,
  key_algorithm, wrapping_algorithm, is_released
)
VALUES
  (
    '86000000-0000-0000-0000-000000000001', NULL,
    decode('00112233445566778899aabbccddeeff', 'hex'),
    'mkv-2026-01', 'AES-256-CBC', 'RSA-OAEP-SHA256', FALSE
  ),
  (
    '86000000-0000-0000-0000-000000000002', NULL,
    decode('ffeeddccbbaa99887766554433221100', 'hex'),
    'mkv-2026-01', 'AES-256-CBC', 'RSA-OAEP-SHA256', FALSE
  )
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- SUBMISSION_TEAMS / MEMBERS
-- ------------------------------------------------------------
INSERT INTO public.submission_teams (id, challenge_id, team_name, lead_user_id)
VALUES
  ('87000000-0000-0000-0000-000000000001', '80000000-0000-0000-0000-000000000001', 'Carbon Cutters', '44444444-4444-4444-4444-444444444444')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.submission_team_members (id, team_id, user_id, contribution_weight)
VALUES
  ('87100000-0000-0000-0000-000000000001', '87000000-0000-0000-0000-000000000001', '44444444-4444-4444-4444-444444444444', 0.60),
  ('87100000-0000-0000-0000-000000000002', '87000000-0000-0000-0000-000000000001', '55555555-5555-5555-5555-555555555555', 0.40)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- SUBMISSIONS
-- ------------------------------------------------------------
INSERT INTO public.submissions (
  id, challenge_id, submitted_by, team_id, title, content_ciphertext, content_iv,
  encrypted_key_id, content_hash_sha256, content_plaintext, attachment_count,
  status, attribution_type, parent_submission_ids, oss_score, cis_score, cvs_score,
  cjs_score, otb_score, pss_total, psa_amount_paise, is_on_time,
  submitted_at, revealed_at, fork_count, merge_count, credit_count, vote_score
)
VALUES
  (
    '88000000-0000-0000-0000-000000000001', '80000000-0000-0000-0000-000000000001',
    '44444444-4444-4444-4444-444444444444', '87000000-0000-0000-0000-000000000001',
    'Factory Heat Recovery Optimizer',
    decode('deadbeefcafebabe0011223344556677', 'hex'), decode('00112233445566778899aabbccddeeff', 'hex'),
    '86000000-0000-0000-0000-000000000001',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    NULL, 1, 'sealed', 'collaborative', '{}'::UUID[],
    NULL, NULL, NULL, NULL, NULL, NULL, NULL,
    TRUE, NOW() - INTERVAL '16 hours', NULL, 0, 0, 0, 0.00
  ),
  (
    '88000000-0000-0000-0000-000000000002', '80000000-0000-0000-0000-000000000001',
    '66666666-6666-6666-6666-666666666666', NULL,
    'Adaptive Scheduling via Reinforcement Learning',
    decode('0123456789abcdef0123456789abcdef', 'hex'), decode('aabbccddeeff00112233445566778899', 'hex'),
    '86000000-0000-0000-0000-000000000002',
    'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    NULL, 0, 'sealed', 'original', '{}'::UUID[],
    NULL, NULL, NULL, NULL, NULL, NULL, NULL,
    FALSE, NOW() - INTERVAL '5 hours', NULL, 0, 0, 0, 0.00
  )
ON CONFLICT (id) DO NOTHING;

UPDATE public.submission_encryption_keys
SET submission_id = '88000000-0000-0000-0000-000000000001'
WHERE id = '86000000-0000-0000-0000-000000000001';

UPDATE public.submission_encryption_keys
SET submission_id = '88000000-0000-0000-0000-000000000002'
WHERE id = '86000000-0000-0000-0000-000000000002';

-- ------------------------------------------------------------
-- SUBMISSION_ATTACHMENTS
-- ------------------------------------------------------------
INSERT INTO public.submission_attachments (
  id, submission_id, original_filename, stored_filename, file_path,
  mime_type, file_size_bytes, file_hash_sha256, is_encrypted,
  encryption_key_id, is_visible
)
VALUES
  (
    '89000000-0000-0000-0000-000000000001', '88000000-0000-0000-0000-000000000001',
    'model-notes.pdf', '89a1c2d3-e4f5-6789-abcd-ef0123456789.pdf',
    'submissions/88000000-0000-0000-0000-000000000001/model-notes.pdf',
    'application/pdf', 245760,
    'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
    TRUE, '86000000-0000-0000-0000-000000000001', FALSE
  )
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- IP_ATTRIBUTION_RECORDS
-- ------------------------------------------------------------
INSERT INTO public.ip_attribution_records (
  id, submission_id, challenge_id, contributor_id_hash, user_id,
  submission_hash_sha256, receipt_timestamp_unix_ms, receipt_timestamp,
  attribution_type, ipar_schema_version, platform_signature,
  signing_key_version, is_verified, backup_replicated_at
)
VALUES
  (
    '8a000000-0000-0000-0000-000000000001',
    '88000000-0000-0000-0000-000000000001',
    '80000000-0000-0000-0000-000000000001',
    'd1f4f2ab0bc78f4fceaf2dfc9e34ebf3f1ad9a4b8fd5cd829f3bb2f6fbe4c1a2',
    '44444444-4444-4444-4444-444444444444',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    EXTRACT(EPOCH FROM NOW())::BIGINT * 1000,
    NOW(),
    'collaborative', 1,
    'base64-signature-placeholder-1',
    'skv-2026-01', TRUE, NULL
  )
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- COLLABORATION_GRAPH_EDGES
-- ------------------------------------------------------------
INSERT INTO public.collaboration_graph_edges (
  id, challenge_id, source_submission_id, target_submission_id, edge_type,
  influence_weight, annotation_text, annotation_type, recorded_by, is_accepted
)
VALUES
  (
    '8b000000-0000-0000-0000-000000000001',
    '80000000-0000-0000-0000-000000000001',
    '88000000-0000-0000-0000-000000000001',
    '88000000-0000-0000-0000-000000000002',
    'annotate', 0.30,
    'Shared energy-balance boundary condition suggestions.',
    'suggestion', '55555555-5555-5555-5555-555555555555', TRUE
  )
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- CIS_COMPUTATIONS
-- ------------------------------------------------------------
INSERT INTO public.cis_computations (
  id, challenge_id, submission_id, user_id, n_influenced,
  n_total_interactions, cis_score, computation_version, computed_at
)
VALUES
  (
    '8c000000-0000-0000-0000-000000000001',
    '80000000-0000-0000-0000-000000000001',
    '88000000-0000-0000-0000-000000000001',
    '44444444-4444-4444-4444-444444444444',
    1, 1, 100.00, 1, NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- COMMUNITY_VOTES
-- ------------------------------------------------------------
INSERT INTO public.community_votes (
  id, challenge_id, voter_id, submission_id, rank_position,
  vote_weight, is_excluded, exclusion_reason, voted_at
)
VALUES
  (
    '8d000000-0000-0000-0000-000000000001',
    '80000000-0000-0000-0000-000000000001',
    '55555555-5555-5555-5555-555555555555',
    '88000000-0000-0000-0000-000000000002',
    1, 1.0000, FALSE, NULL, NOW() - INTERVAL '2 hours'
  )
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- CHALLENGE_JUDGES / JUDGE_SCORES
-- ------------------------------------------------------------
INSERT INTO public.challenge_judges (
  id, challenge_id, judge_user_id, assigned_by, is_external, external_name, external_email
)
VALUES
  (
    '8e000000-0000-0000-0000-000000000001',
    '80000000-0000-0000-0000-000000000001',
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    FALSE, NULL, NULL
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.judge_scores (
  id, challenge_id, submission_id, judge_user_id, score_type,
  criterion_id, raw_score, normalised_score, written_comment
)
VALUES
  (
    '8f000000-0000-0000-0000-000000000001',
    '80000000-0000-0000-0000-000000000001',
    '88000000-0000-0000-0000-000000000001',
    '22222222-2222-2222-2222-222222222222',
    'oss', '81000000-0000-0000-0000-000000000001', 86.00, 86.00,
    'Strong baseline with clear execution assumptions.'
  )
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- PSS_COMPUTATIONS / PRIZE_DISBURSEMENTS
-- ------------------------------------------------------------
INSERT INTO public.pss_computations (
  id, challenge_id, submission_id, user_id, oss_score, cis_score, cvs_score,
  cjs_score, otb_score, pss_total, pss_rank, psa_amount_paise,
  is_final, finalised_at, computed_at, computation_version
)
VALUES
  (
    '90000000-0000-0000-0000-000000000001',
    '80000000-0000-0000-0000-000000000001',
    '88000000-0000-0000-0000-000000000001',
    '44444444-4444-4444-4444-444444444444',
    86.00, 100.00, 72.00, 84.00, 100.00,
    88.25, 1, 620000, TRUE, NOW(), NOW(), 1
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.escrow_transactions (
  id, escrow_account_id, transaction_type, amount_paise, recipient_user_id,
  payment_gateway, gateway_transaction_id, gateway_reference, status,
  initiated_at, completed_at, metadata
)
VALUES
  (
    '91000000-0000-0000-0000-000000000001',
    '84000000-0000-0000-0000-000000000001',
    'prize_release', 620000,
    '44444444-4444-4444-4444-444444444444',
    'neft', 'neft_txn_001', 'neft_ref_001',
    'processing', NOW(), NULL,
    '{"batch":"final-award"}'::JSONB
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.prize_disbursements (
  id, challenge_id, pss_computation_id, escrow_transaction_id, recipient_user_id,
  amount_paise, pss_score, pss_rank, status, payment_method, payment_reference,
  disbursed_at, failure_reason
)
VALUES
  (
    '92000000-0000-0000-0000-000000000001',
    '80000000-0000-0000-0000-000000000001',
    '90000000-0000-0000-0000-000000000001',
    '91000000-0000-0000-0000-000000000001',
    '44444444-4444-4444-4444-444444444444',
    620000, 88.25, 1, 'processing', 'neft', 'UTR-00012345',
    NULL, NULL
  )
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- CONTRIBUTOR_BANK_ACCOUNTS
-- ------------------------------------------------------------
INSERT INTO public.contributor_bank_accounts (
  id, user_id, account_holder_name, account_type, account_number_hash,
  account_number_last4, ifsc_code, upi_id, bank_name,
  is_verified, is_primary
)
VALUES
  (
    '93000000-0000-0000-0000-000000000001',
    '44444444-4444-4444-4444-444444444444',
    'Aditya Rao', 'savings',
    'f1ce9a52d4f335f5f5b89a40df20dbf7b32f2f16d80c7270d0f7c5b1939b95ce',
    '1287', 'HDFC0001234', NULL, 'HDFC Bank', TRUE, TRUE
  ),
  (
    '93000000-0000-0000-0000-000000000002',
    '55555555-5555-5555-5555-555555555555',
    'Mira Kapoor', 'upi',
    NULL, NULL, NULL, 'mira@upi', NULL, TRUE, TRUE
  )
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- REPUTATION_PROFILES
-- ------------------------------------------------------------
INSERT INTO public.reputation_profiles (
  id, user_id, total_pss_accumulated, total_earnings_paise, challenges_entered,
  challenges_with_award, rank_1_count, top_3_count, top_10_count,
  avg_oss_score, avg_cis_score, avg_cvs_score, avg_cjs_score, avg_otb_rate,
  discipline_breakdown, win_rate_percent, composite_reputation_score,
  global_rank, discipline_rank
)
VALUES
  (
    '94000000-0000-0000-0000-000000000001',
    '44444444-4444-4444-4444-444444444444',
    610.40, 1850000, 12, 5, 3, 7, 11,
    84.10, 79.80, 80.30, 82.40, 91.67,
    '{"Engineering": 9, "Research": 3}'::JSONB,
    41.67, 88.70, 4,
    '{"Engineering": 2, "Research": 5}'::JSONB
  ),
  (
    '94000000-0000-0000-0000-000000000002',
    '55555555-5555-5555-5555-555555555555',
    332.10, 730000, 9, 2, 1, 4, 8,
    70.00, 72.30, 78.20, 73.00, 77.78,
    '{"Design": 7, "Marketing": 2}'::JSONB,
    22.22, 76.40, 11,
    '{"Design": 4, "Marketing": 6}'::JSONB
  )
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- SKILL_ENDORSEMENTS
-- ------------------------------------------------------------
INSERT INTO public.skill_endorsements (
  id, contributor_user_id, endorser_user_id, challenge_id, skill_name
)
VALUES
  (
    '95000000-0000-0000-0000-000000000001',
    '44444444-4444-4444-4444-444444444444',
    '22222222-2222-2222-2222-222222222222',
    '80000000-0000-0000-0000-000000000001',
    'Systems Thinking'
  ),
  (
    '95000000-0000-0000-0000-000000000002',
    '55555555-5555-5555-5555-555555555555',
    '33333333-3333-3333-3333-333333333333',
    '80000000-0000-0000-0000-000000000002',
    'Service Blueprinting'
  )
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- RECRUITER_API_ACCESS / REQUESTS
-- ------------------------------------------------------------
INSERT INTO public.recruiter_api_access (
  id, organisation_name, contact_email, api_key_hash, api_key_prefix,
  subscription_tier, monthly_request_limit, requests_this_month, is_active, expires_at
)
VALUES
  (
    '96000000-0000-0000-0000-000000000001',
    'TalentForge Recruiters', 'api@talentforge.test',
    'b7dc8f9e2bd2f4579e45b2d1e0f4f22d4f3d2de0f3e2d4c9b1f84d4c5f8e7a11',
    'rec_7f3a', 'professional', 5000, 42, TRUE, NOW() + INTERVAL '1 year'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.recruiter_api_requests (
  id, api_key_id, endpoint, target_user_id, response_code, requested_at
)
VALUES
  (
    '97000000-0000-0000-0000-000000000001',
    '96000000-0000-0000-0000-000000000001',
    '/v1/reputation/44444444-4444-4444-4444-444444444444',
    '44444444-4444-4444-4444-444444444444',
    200,
    NOW() - INTERVAL '1 day'
  )
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- NOTIFICATIONS
-- ------------------------------------------------------------
INSERT INTO public.notifications (
  id, user_id, type, title, body, related_entity_type,
  related_entity_id, action_url, is_read, read_at, created_at
)
VALUES
  (
    '98000000-0000-0000-0000-000000000001',
    '44444444-4444-4444-4444-444444444444',
    'phase_transition',
    'Challenge moved to sealed phase',
    'Decarbonised Manufacturing Workflow is now in sealed submissions phase.',
    'challenge', '80000000-0000-0000-0000-000000000001',
    '/challenges/decarbonised-manufacturing-workflow',
    FALSE, NULL, NOW() - INTERVAL '1 hour'
  ),
  (
    '98000000-0000-0000-0000-000000000002',
    '55555555-5555-5555-5555-555555555555',
    'collaboration_activity',
    'You received a collaboration annotation',
    'A collaborator left actionable suggestions on your contribution.',
    'submission', '88000000-0000-0000-0000-000000000002',
    '/submissions/88000000-0000-0000-0000-000000000002',
    FALSE, NULL, NOW() - INTERVAL '30 minutes'
  )
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- AUDIT_LOGS (append-only, insert only)
-- ------------------------------------------------------------
INSERT INTO public.audit_logs (
  id, actor_user_id, action, entity_type, entity_id,
  ip_address, user_agent, old_state, new_state, metadata
)
VALUES
  (
    '99000000-0000-0000-0000-000000000001',
    '22222222-2222-2222-2222-222222222222',
    'challenge.created', 'challenge',
    '80000000-0000-0000-0000-000000000001',
    '103.21.244.5', 'Mozilla/5.0',
    NULL,
    '{"status":"active","title":"Decarbonised Manufacturing Workflow"}'::JSONB,
    '{"source":"dashboard"}'::JSONB
  ),
  (
    '99000000-0000-0000-0000-000000000002',
    NULL,
    'submission.sealed', 'submission',
    '88000000-0000-0000-0000-000000000001',
    NULL, NULL,
    NULL,
    '{"status":"sealed"}'::JSONB,
    '{"source":"system"}'::JSONB
  )
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- PLATFORM_SETTINGS
-- ------------------------------------------------------------
INSERT INTO public.platform_settings (
  id, setting_key, setting_value, value_type, description,
  is_sensitive, updated_by, updated_at
)
VALUES
  ('9a000000-0000-0000-0000-000000000001', 'platform_fee_percent', '8', 'decimal', 'Platform fee %', FALSE, '11111111-1111-1111-1111-111111111111', NOW()),
  ('9a000000-0000-0000-0000-000000000002', 'min_prize_pool_paise', '500000', 'integer', 'Minimum prize pool = Rs 5,000', FALSE, '11111111-1111-1111-1111-111111111111', NOW()),
  ('9a000000-0000-0000-0000-000000000003', 'phase2_min_days', '7', 'integer', 'Minimum blind window days', FALSE, '11111111-1111-1111-1111-111111111111', NOW()),
  ('9a000000-0000-0000-0000-000000000004', 'oss_weight', '0.35', 'decimal', 'OSS weight in PSS formula', FALSE, '11111111-1111-1111-1111-111111111111', NOW()),
  ('9a000000-0000-0000-0000-000000000005', 'cis_weight', '0.25', 'decimal', 'CIS weight in PSS formula', FALSE, '11111111-1111-1111-1111-111111111111', NOW()),
  ('9a000000-0000-0000-0000-000000000006', 'cvs_weight', '0.15', 'decimal', 'CVS weight in PSS formula', FALSE, '11111111-1111-1111-1111-111111111111', NOW()),
  ('9a000000-0000-0000-0000-000000000007', 'cjs_weight', '0.20', 'decimal', 'CJS weight in PSS formula', FALSE, '11111111-1111-1111-1111-111111111111', NOW()),
  ('9a000000-0000-0000-0000-000000000008', 'otb_weight', '0.05', 'decimal', 'OTB weight in PSS formula', FALSE, '11111111-1111-1111-1111-111111111111', NOW()),
  ('9a000000-0000-0000-0000-000000000009', 'otb_window_hours', '48', 'integer', 'Hours for on-time bonus', FALSE, '11111111-1111-1111-1111-111111111111', NOW())
ON CONFLICT (setting_key) DO NOTHING;

-- ------------------------------------------------------------
-- REVEAL_EXECUTION_LOGS
-- ------------------------------------------------------------
INSERT INTO public.reveal_execution_logs (
  id, challenge_id, triggered_at, started_at, completed_at, status,
  submissions_decrypted, submissions_failed, transaction_id,
  error_message, execution_duration_ms
)
VALUES
  (
    '9b000000-0000-0000-0000-000000000001',
    '80000000-0000-0000-0000-000000000001',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days' + INTERVAL '1 second',
    NOW() - INTERVAL '3 days' + INTERVAL '7 seconds',
    'completed', 2, 0, 'tx-2026-0001', NULL, 6000
  )
ON CONFLICT (id) DO NOTHING;

COMMIT;
