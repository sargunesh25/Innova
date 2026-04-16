-- ============================================================
-- INNOVA — Seed Data
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- Run AFTER schema.sql has been executed
-- ============================================================

-- ─── CHALLENGES ─────────────────────────────────────────────
INSERT INTO public.challenges (id, title, description, problem_statement, problem_detail, category, subcategory, phase, current_phase, status, prize, prize_value, prize_type, grand_prize, difficulty, days_left, time_label, time_left, time_color, submissions_count, participants_count) VALUES
(1, 'Quantum Synthesis Challenge', 'Submit groundbreaking approaches to room-temperature quantum coherence.', 'How can we achieve stable quantum coherence at room temperature?', 'Current quantum systems require extreme cooling to near absolute zero. We challenge innovators to propose novel approaches—whether through topological protection, engineered decoherence barriers, or hybrid classical-quantum architectures—that could enable practical quantum operations at ambient conditions.', 'Quantum Computing', 'Quantum Engineering', 'Accepting Submissions', 'Open', 'Open', '₹75,000', 75000, 'RESEARCH GRANT', '₹75,000', 'Advanced', 32, '32d Left', '32 DAYS LEFT', 'green', 47, 124),

(2, 'Forest Canopy Mapping Initiative', 'Build AI-powered tools for real-time forest canopy analysis using satellite imagery.', 'How can we monitor global forest health in real-time?', 'Deforestation and forest degradation account for nearly 15% of global CO2 emissions. We need innovative AI/ML approaches that can process satellite imagery at scale to detect canopy changes, predict deforestation patterns, and enable rapid response by conservation teams.', 'Environmental Science', 'AI & Remote Sensing', 'Accepting Submissions', 'Open', 'Open', '₹50,000', 50000, 'INNOVATION PRIZE', '₹50,000', 'Intermediate', 18, '18d Left', '18 DAYS LEFT', 'yellow', 31, 89),

(3, 'Neural Architecture Search', 'Design self-optimizing neural network architectures for edge deployment.', 'Can we automate the design of efficient neural networks for resource-constrained devices?', 'Edge devices—smartphones, IoT sensors, drones—need neural networks that are both accurate and lightweight. This challenge seeks novel NAS algorithms, pruning strategies, or knowledge distillation techniques that can automatically discover architectures optimized for specific hardware constraints.', 'Machine Learning', 'Neural Engineering', 'Accepting Submissions', 'Open', 'Open', '₹1,00,000', 100000, 'GRAND RESEARCH PRIZE', '₹1,00,000', 'Expert', 45, '45d Left', '45 DAYS LEFT', 'green', 23, 67),

(4, 'Sustainable Urban Mobility', 'Reimagine public transit for cities with populations over 10 million.', 'How do we design equitable, carbon-neutral urban transit systems?', 'Megacities face gridlock, pollution, and inequitable access to transportation. We seek proposals for integrated mobility platforms—combining autonomous vehicles, micro-transit, cycling infrastructure, and digital ticketing—that can reduce emissions by 60% while improving accessibility for underserved communities.', 'Urban Design', 'Transportation', 'Evaluation Phase', 'Evaluation', 'Sealed', '₹60,000', 60000, 'IMPLEMENTATION GRANT', '₹60,000', 'Intermediate', 5, '5d Left', '5 DAYS LEFT', 'red', 56, 142),

(5, 'Bio-Inspired Materials Challenge', 'Develop materials that mimic biological self-healing properties.', 'Can we engineer materials that repair themselves like living tissue?', 'Nature has evolved remarkable self-healing mechanisms—from lizard tail regeneration to bone repair. This challenge invites proposals for synthetic materials that can autonomously detect damage, initiate repair processes, and restore structural integrity without external intervention.', 'Materials Science', 'Biomimetics', 'Accepting Submissions', 'Open', 'Open', '₹85,000', 85000, 'RESEARCH GRANT', '₹85,000', 'Advanced', 28, '28d Left', '28 DAYS LEFT', 'green', 19, 51),

(6, 'Decentralized Identity Framework', 'Build a privacy-preserving digital identity system using zero-knowledge proofs.', 'How can we verify identity without revealing personal data?', 'Current digital identity systems create honeypots of personal data. We challenge teams to design decentralized identity frameworks using zero-knowledge proofs, verifiable credentials, and distributed ledger technology that let users prove attributes (age, citizenship, qualifications) without exposing underlying data.', 'Cryptography', 'Privacy Engineering', 'Accepting Submissions', 'Open', 'Open', '₹90,000', 90000, 'INNOVATION PRIZE', '₹90,000', 'Expert', 38, '38d Left', '38 DAYS LEFT', 'green', 12, 44);

-- ─── CHALLENGE HOSTS ────────────────────────────────────────
INSERT INTO public.challenge_hosts (challenge_id, name, logo_initial, verified, description) VALUES
(1, 'QuantumLabs International', 'Q', true, 'Autonomous systems research division focused on next-generation quantum computing platforms.'),
(2, 'GreenEarth Foundation', 'G', true, 'Global environmental conservation organization leveraging technology for sustainability.'),
(3, 'DeepMind Research', 'D', true, 'Artificial intelligence research laboratory pushing the boundaries of neural computation.'),
(4, 'MetroPlan Global', 'M', true, 'Urban planning consultancy designing the cities of tomorrow.'),
(5, 'BioSynth Labs', 'B', true, 'Materials science research institute specializing in biomimetic engineering.'),
(6, 'CryptoGuard Foundation', 'C', true, 'Privacy-focused technology foundation advancing decentralized identity solutions.');

-- ─── CHALLENGE CONSTRAINTS ──────────────────────────────────
INSERT INTO public.challenge_constraints (challenge_id, content, position) VALUES
(1, 'Solutions must operate at temperatures above 250K', 1),
(1, 'No exotic materials requiring specialized containment', 2),
(1, 'Must demonstrate scalability to at least 50 qubits', 3),
(1, 'Proof of concept must be reproducible in standard lab conditions', 4),
(2, 'Must process imagery at minimum 10m resolution', 1),
(2, 'Latency from capture to analysis must not exceed 4 hours', 2),
(2, 'Algorithm must work across tropical, temperate, and boreal forests', 3),
(3, 'Target devices: ARM Cortex-M7 or equivalent (≤512KB RAM)', 1),
(3, 'Inference latency must not exceed 100ms', 2),
(3, 'Search space must include at least 10^8 candidate architectures', 3);

-- ─── JUDGING CRITERIA ───────────────────────────────────────
INSERT INTO public.judging_criteria (challenge_id, title, weight, description) VALUES
(1, 'Technical Feasibility', 40, 'Likelihood of achieving room-temperature coherence with proposed approach'),
(1, 'Innovation & Novelty', 30, 'Originality of the theoretical framework or experimental design'),
(1, 'Scalability Potential', 20, 'Path from proof-of-concept to practical quantum systems'),
(1, 'Documentation Quality', 10, 'Clarity and rigor of the submitted manuscript'),
(2, 'Accuracy & Precision', 35, 'Detection accuracy of canopy changes against ground truth data'),
(2, 'Scalability', 25, 'Ability to process continent-scale imagery efficiently'),
(2, 'Real-world Impact', 25, 'Demonstrated potential for immediate conservation application'),
(2, 'Code Quality', 15, 'Clean, documented, reproducible codebase');

-- ─── CHALLENGE RESOURCES ────────────────────────────────────
INSERT INTO public.challenge_resources (challenge_id, name, url) VALUES
(1, 'Research Brief.pdf', '#'),
(1, 'Quantum Coherence Dataset', '#'),
(1, 'Evaluation Rubric v2.1', '#'),
(2, 'Satellite Imagery API Docs', '#'),
(2, 'Sample Forest Dataset (10GB)', '#'),
(3, 'Hardware Specification Sheet', '#'),
(3, 'Baseline NAS Implementation', '#');

-- ─── OPPORTUNITIES ──────────────────────────────────────────
INSERT INTO public.opportunities (id, title, description, prize, tag, image_url, is_hero, hero_text, stats, featured) VALUES
('opp-1', 'Advanced Quantum Computing Fellowship', 'Join a 12-month research fellowship at a leading quantum computing institute.', '₹1,20,000 + Lab Access', 'FELLOWSHIP', '/quantum_chip.webp', true, 'Quantum chip fellowship — 12 months of cutting-edge research with full lab access and mentorship.', '3 Positions Available', true),
('opp-2', 'Climate AI Research Grant', 'Funding for AI applications in climate science and environmental monitoring.', '₹75,000', 'RESEARCH GRANT', '/forest_canopy.webp', false, NULL, '12 Grants Available', true),
('opp-3', 'Neural Engineering Internship', 'Summer internship program with top neural engineering labs.', '₹30,000 Stipend', 'INTERNSHIP', NULL, false, NULL, '8 Spots Open', true);

-- ─── DONE ───────────────────────────────────────────────────
-- You should now see data on:
--   /challenges  → 6 challenge cards
--   /dashboard   → active challenges (once you create submissions)
--   /dashboard   → featured opportunities (3 cards)
