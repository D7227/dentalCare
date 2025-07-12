--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bills (
    id integer NOT NULL,
    order_id integer,
    amount text,
    status text DEFAULT 'pending'::text,
    payment_method text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.bills OWNER TO postgres;

--
-- Name: chats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chats (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    type text NOT NULL,
    title text,
    participants jsonb DEFAULT '[]'::jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    clinic_id uuid NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_by text
);


ALTER TABLE public.chats OWNER TO postgres;

--
-- Name: clinic; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clinic (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    firstname text NOT NULL,
    lastname text NOT NULL,
    email text NOT NULL,
    phone text,
    clinic_name text,
    clinic_license_number text,
    clinic_address_line1 text,
    clinic_address_line2 text,
    clinic_city text,
    clinic_state text,
    clinic_pincode text,
    clinic_country text,
    gst_number text,
    pan_number text,
    billing_address_line1 text,
    billing_address_line2 text,
    billing_city text,
    billing_state text,
    billing_pincode text,
    billing_country text,
    password text NOT NULL,
    role_id uuid NOT NULL,
    permissions jsonb DEFAULT '[]'::jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.clinic OWNER TO postgres;

--
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.companies (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text
);


ALTER TABLE public.companies OWNER TO postgres;

--
-- Name: lifecycle_stages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lifecycle_stages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    date date,
    "time" text,
    person text NOT NULL,
    role text NOT NULL,
    icon text
);


ALTER TABLE public.lifecycle_stages OWNER TO postgres;

--
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    chat_id uuid NOT NULL,
    order_id uuid,
    sender text NOT NULL,
    sender_role text NOT NULL,
    sender_type text NOT NULL,
    content text NOT NULL,
    message_type text DEFAULT 'text'::text,
    attachments jsonb DEFAULT '[]'::jsonb,
    read_by jsonb DEFAULT '[]'::jsonb,
    created_at timestamp without time zone DEFAULT now(),
    sender_id uuid
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id uuid NOT NULL,
    category text,
    type text,
    first_name text,
    last_name text,
    age text,
    sex text,
    case_handled_by text,
    doctor_mobile text,
    consulting_doctor text,
    consulting_doctor_mobile text,
    order_method text,
    prescription_type text,
    subcategory_type text,
    restoration_type text,
    product_selection text,
    order_type text,
    selected_file_type text,
    selected_teeth jsonb,
    tooth_groups jsonb,
    tooth_numbers text[],
    abutment_details jsonb,
    clinic_id text,
    abutment_type text,
    restoration_products jsonb,
    pontic_design text,
    occlusal_staining text,
    shade_instruction text,
    clearance text,
    accessories text[],
    other_accessory text,
    return_accessories boolean,
    notes text,
    files jsonb,
    expected_delivery_date date,
    pickup_date date,
    pickup_time text,
    pickup_remarks text,
    scan_booking jsonb,
    previous_order_id text,
    repair_order_id text,
    issue_description text,
    repair_type text,
    return_with_trial boolean,
    teeth_edited_by_user boolean,
    intra_oral_scans jsonb,
    face_scans jsonb,
    patient_photos jsonb,
    referral_files jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    order_id text,
    ref_id text,
    percentage text,
    is_urgent boolean,
    currency text,
    total_amount text,
    export_quality text,
    payment_status text,
    order_status text,
    crate_no text,
    additional_note text,
    rejection_reason text
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: patients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patients (
    id integer NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    age text,
    sex text,
    contact text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.patients OWNER TO postgres;

--
-- Name: pickup_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pickup_requests (
    id integer NOT NULL,
    order_id integer,
    pickup_date timestamp without time zone,
    status text DEFAULT 'pending'::text,
    address text,
    agent_name text,
    notes text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.pickup_requests OWNER TO postgres;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    material text NOT NULL,
    description text
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.role OWNER TO postgres;

--
-- Name: scan_bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.scan_bookings (
    id integer NOT NULL,
    order_id integer,
    booking_date timestamp without time zone,
    status text DEFAULT 'scheduled'::text,
    notes text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.scan_bookings OWNER TO postgres;

--
-- Name: team_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.team_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    full_name text NOT NULL,
    email text NOT NULL,
    contact_number text,
    profile_picture text,
    role_id uuid NOT NULL,
    permissions jsonb DEFAULT '[]'::jsonb,
    status text DEFAULT 'active'::text,
    password text,
    join_date timestamp without time zone DEFAULT now(),
    last_login timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    clinic_name text
);


ALTER TABLE public.team_members OWNER TO postgres;

--
-- Name: tooth_groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tooth_groups (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid,
    group_id text NOT NULL,
    teeth jsonb NOT NULL,
    type text NOT NULL,
    notes text,
    material text,
    shade text,
    warning text
);


ALTER TABLE public.tooth_groups OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    mobile_number text NOT NULL,
    password text NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: bills; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: chats; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.chats VALUES ('179b356b-05d2-4d68-a935-0a08ecdeff24', '5770d8ec-fd73-4d55-a4af-55785439591c', 'order', 'da', '["Tatiana Peters"]', '2025-07-04 18:20:09.8375', '2025-07-04 18:20:09.8375', '2ef6b59d-3738-4672-9a86-c33b606251f8', true, 'Tatiana Peters');
INSERT INTO public.chats VALUES ('72417e64-46fd-48d4-9715-2d437dea6461', 'be84f6f0-2966-41c2-ba95-23805cea4a7a', 'order', 'asdas d', '["conasd Peters", "NUk123 Sadan", "ASd"]', '2025-07-08 03:07:48.186246', '2025-07-07 21:43:04.547', '2ef6b59d-3738-4672-9a86-c33b606251f8', true, 'conasd Peters');
INSERT INTO public.chats VALUES ('0f281af0-c999-4eef-98c3-cb7bcc8f669c', '83bfe684-b57f-4a0b-b626-541d83f1d63b', 'order', 'adsasd', '["conasd Peters"]', '2025-07-12 14:54:22.994334', '2025-07-12 14:54:22.994334', '2ef6b59d-3738-4672-9a86-c33b606251f8', true, 'conasd Peters');


--
-- Data for Name: clinic; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.clinic VALUES ('e2857e66-b7c6-45ba-b831-8e06c6f7cdaf', 'Rama', 'Elliott', 'tibamykax@mailinator.com', '1201201201', 'Raymond Clarke', '98422', '72 South Old Avenue', 'Odit expedita incidi', 'Reiciendis cupidatat', 'Eius aliquam est qui', 'Unde adipisicing ita', 'Culpa est ut tempora', '22AAAAA0000A1Z5', 'AAAAA0000A', '56 South Hague Extension', 'Lorem fuga Deleniti', 'Harum et possimus s', 'Sint nihil sunt dolo', 'Ducimus cupidatat q', 'Corrupti consectetu', 'Pa$$w0rd!', '2411f233-1e48-43ae-9af9-6d5ce0569278', '["scan_booking", "tracking", "pickup_requests", "chat", "all_patients", "billing"]', '2025-07-04 19:05:11.776201', '2025-07-04 19:05:11.776201');
INSERT INTO public.clinic VALUES ('2ef6b59d-3738-4672-9a86-c33b606251f8', 'conasd', 'Peters', 'tyfenaqyc@mailinator.com', '1123456789', 'Pamela Sherman', '65566', '565 Fabien Lane', 'Non quos magna non h', 'Est quis soluta comm', 'Eum minim in aliquam', 'Sit voluptas except', 'In non quis quam sed', '22AAAAA0000A1Z5', 'AAAAA0000A', '82 West Green Old Avenue', 'Provident aperiam f', 'Aut iste voluptates ', 'Amet proident aut ', 'Magni neque cum temp', 'Nisi odio est ad qu', 'Pa$$w0rd!', '2411f233-1e48-43ae-9af9-6d5ce0569278', '["scan_booking", "tracking", "pickup_requests", "chat", "all_patients", "billing"]', '2025-07-04 13:19:29.645233', '2025-07-04 13:19:29.645233');


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.companies VALUES ('3793410f-522c-4553-9b3e-9e014352512e', 'Straumann');
INSERT INTO public.companies VALUES ('bfba15e6-1c11-44f3-83d3-22dd0d4726f6', 'Nobel Biocare');
INSERT INTO public.companies VALUES ('2195ecc0-ef80-4a4e-a9a7-78c2a081c233', 'Osstem');
INSERT INTO public.companies VALUES ('60575c4a-be37-47c5-8892-6599d394cad2', 'Dentsply');


--
-- Data for Name: lifecycle_stages; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.lifecycle_stages VALUES ('149bb5a3-daa9-49cb-b1a2-24d01cb3665c', 'Submitted', '2025-06-10', '10:15 AM', 'Dr. Sarah Mitchell', 'Doctor', 'Check');
INSERT INTO public.lifecycle_stages VALUES ('cae628ea-cfdc-4947-b16e-3bec2ef9c7a1', 'Picked Up', '2025-06-11', '12:30 PM', 'John Kumar', 'Field Agent', 'Package');
INSERT INTO public.lifecycle_stages VALUES ('29b4095c-a9c6-4e09-b4a6-db795dc9f526', 'Inwarded', '2025-06-12', '03:45 PM', 'Priya Sharma', 'Lab Assistant', 'Activity');
INSERT INTO public.lifecycle_stages VALUES ('7713d423-b7cc-4bd9-9147-d8a36ae3dd5c', 'QA Approved', '2025-06-13', '09:10 AM', 'Rajesh Gupta', 'QA Manager', 'ClipboardCheck');
INSERT INTO public.lifecycle_stages VALUES ('6fcd24ef-e222-4fa9-9513-b85967a7866d', 'In Progress', '2025-06-14', '11:50 AM', 'Amit Patel', 'Technician', 'Wrench');
INSERT INTO public.lifecycle_stages VALUES ('5847420b-15ec-4a6d-96f0-6b5cc5d5a432', 'Trial Sent', NULL, NULL, 'Sunita Roy', 'Lab Manager', 'ThumbsUp');
INSERT INTO public.lifecycle_stages VALUES ('6fce4c21-acc9-43b9-95b4-6c009a3af976', 'Finalizing', NULL, NULL, 'Vikram Singh', 'Senior Technician', 'Wrench');
INSERT INTO public.lifecycle_stages VALUES ('fb4d670a-d8a9-4f08-9737-4bbfe45a37ea', 'Dispatched', NULL, NULL, 'Delivery Team', 'Logistics', 'Truck');
INSERT INTO public.lifecycle_stages VALUES ('7c54ed92-03a3-4b1c-9e0c-a83203cbefa7', 'Delivered', '2025-06-18', '05:00 PM', 'John Kumar', 'Field Agent', 'MapPin');


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.messages VALUES ('efe848ee-9e30-43ca-bb96-44edab085433', 'ad3bc31d-a7e8-41e1-85cd-cc299c68ddf1', NULL, 'ass', 'admin_doctor', 'team', 'asdasdasd', 'text', '[]', '["ass", "Kenneth Cole"]', '2025-06-25 01:27:13.20302', NULL);
INSERT INTO public.messages VALUES ('6eef3ca2-b932-43d9-a1d4-a84ebc9a3b01', '146ba707-cdd7-440b-b68d-8a19f38be2ee', NULL, 'ass', 'admin_doctor', 'team', 'dasdasdsa', 'text', '[]', '["ass", "def2cfe9-d1a5-4a9b-ae8a-cb953133fa72", "1f6e0c04-708c-425e-b293-fe1f6c8b7709", "Kenneth Cole", "asasistent"]', '2025-06-25 14:18:00.723556', NULL);
INSERT INTO public.messages VALUES ('66538b51-b273-4e03-9c61-c1bf9980d022', '146ba707-cdd7-440b-b68d-8a19f38be2ee', NULL, 'ass', 'admin_doctor', 'team', 'asdasd', 'text', '[]', '["ass", "def2cfe9-d1a5-4a9b-ae8a-cb953133fa72", "1f6e0c04-708c-425e-b293-fe1f6c8b7709", "Kenneth Cole", "asasistent"]', '2025-06-25 14:07:27.980978', NULL);
INSERT INTO public.messages VALUES ('60cc04b4-5310-47d6-b328-6fff833b2fcc', '0f9cfb0d-7228-469f-8500-e8a35c7807d8', NULL, 'Kenneth Cole', 'main_doctor', 'team', 'asdasd', 'text', '[]', '["Kenneth Cole", "ass", "assistant", "def2cfe9-d1a5-4a9b-ae8a-cb953133fa72", "1f6e0c04-708c-425e-b293-fe1f6c8b7709", "asasistent"]', '2025-06-25 01:27:07.659594', NULL);
INSERT INTO public.messages VALUES ('dfa5adb5-1099-4ada-8a34-ce934d30d289', '0f9cfb0d-7228-469f-8500-e8a35c7807d8', NULL, 'ass', 'admin_doctor', 'team', 'asd34w rt34', 'text', '[]', '["ass", "Kenneth Cole", "assistant", "def2cfe9-d1a5-4a9b-ae8a-cb953133fa72", "1f6e0c04-708c-425e-b293-fe1f6c8b7709", "asasistent"]', '2025-06-25 01:29:35.362105', NULL);
INSERT INTO public.messages VALUES ('50245b6c-bf08-4dd4-8905-cdd355a83f50', 'ad3bc31d-a7e8-41e1-85cd-cc299c68ddf1', NULL, 'Kenneth Cole', 'main_doctor', 'team', 'asdawq 3r ', 'text', '[]', '["Kenneth Cole", "ass"]', '2025-06-25 01:29:27.283656', NULL);
INSERT INTO public.messages VALUES ('a64219a0-a647-4875-9329-0cf62971ee46', '0f9cfb0d-7228-469f-8500-e8a35c7807d8', NULL, 'Kenneth Cole', 'main_doctor', 'team', 'dwqqd', 'text', '[]', '["Kenneth Cole", "ass", "assistant", "def2cfe9-d1a5-4a9b-ae8a-cb953133fa72", "1f6e0c04-708c-425e-b293-fe1f6c8b7709", "asasistent"]', '2025-06-25 01:30:14.994518', NULL);
INSERT INTO public.messages VALUES ('d542ac83-9fc5-4f88-89ba-e1a945ab32fc', '0f9cfb0d-7228-469f-8500-e8a35c7807d8', NULL, 'Kenneth Cole', 'main_doctor', 'team', 'asdwqd', 'text', '[]', '["Kenneth Cole", "ass", "assistant", "def2cfe9-d1a5-4a9b-ae8a-cb953133fa72", "1f6e0c04-708c-425e-b293-fe1f6c8b7709", "asasistent"]', '2025-06-25 10:33:26.541249', NULL);
INSERT INTO public.messages VALUES ('a51a032d-fbf1-413a-aabe-dcead5afe55b', '0f9cfb0d-7228-469f-8500-e8a35c7807d8', NULL, 'Kenneth Cole', 'main_doctor', 'team', 'wqdqwd', 'text', '[]', '["Kenneth Cole", "ass", "assistant", "def2cfe9-d1a5-4a9b-ae8a-cb953133fa72", "1f6e0c04-708c-425e-b293-fe1f6c8b7709", "asasistent"]', '2025-06-25 10:51:42.917054', NULL);
INSERT INTO public.messages VALUES ('0d32d918-a79c-41df-9ab2-869c738905d5', 'ad3bc31d-a7e8-41e1-85cd-cc299c68ddf1', NULL, 'Kenneth Cole', 'main_doctor', 'team', 'dasdasd', 'text', '[]', '["Kenneth Cole", "ass"]', '2025-06-25 01:44:52.37121', NULL);
INSERT INTO public.messages VALUES ('0624658e-9623-40c4-a7a3-4b816810760f', 'ad3bc31d-a7e8-41e1-85cd-cc299c68ddf1', NULL, 'ass', 'admin_doctor', 'team', 'asdasd', 'text', '[]', '["ass", "Kenneth Cole"]', '2025-06-25 10:54:52.732173', NULL);
INSERT INTO public.messages VALUES ('68c1c7a4-9e07-4ce0-a573-091cea41771e', '0f9cfb0d-7228-469f-8500-e8a35c7807d8', NULL, 'ass', 'admin_doctor', 'team', 'asd', 'text', '[]', '["ass", "Kenneth Cole", "assistant", "def2cfe9-d1a5-4a9b-ae8a-cb953133fa72", "1f6e0c04-708c-425e-b293-fe1f6c8b7709", "asasistent"]', '2025-06-25 10:54:37.453553', NULL);
INSERT INTO public.messages VALUES ('bb91a0d3-f4f4-4253-84db-163a09971bea', '0f9cfb0d-7228-469f-8500-e8a35c7807d8', NULL, 'ass', 'admin_doctor', 'team', 'aswq', 'text', '[]', '["ass", "Kenneth Cole", "assistant", "def2cfe9-d1a5-4a9b-ae8a-cb953133fa72", "1f6e0c04-708c-425e-b293-fe1f6c8b7709", "asasistent"]', '2025-06-25 10:54:49.300546', NULL);
INSERT INTO public.messages VALUES ('9089cab0-7afd-4b63-9669-f543d060dee4', 'ad3bc31d-a7e8-41e1-85cd-cc299c68ddf1', NULL, 'Kenneth Cole', 'main_doctor', 'team', '21e', 'text', '[]', '["Kenneth Cole", "ass"]', '2025-06-25 10:55:08.419706', NULL);
INSERT INTO public.messages VALUES ('5de95207-6657-48d2-8995-c5c9846bb172', 'ad3bc31d-a7e8-41e1-85cd-cc299c68ddf1', NULL, 'ass', 'admin_doctor', 'team', 'qw qd213', 'text', '[]', '["ass", "Kenneth Cole"]', '2025-06-25 10:56:03.091392', NULL);
INSERT INTO public.messages VALUES ('8837c2e5-6de5-405b-9e40-b8b9763c5042', 'ad3bc31d-a7e8-41e1-85cd-cc299c68ddf1', NULL, 'Kenneth Cole', 'main_doctor', 'team', 'w dwqd', 'text', '[]', '["Kenneth Cole", "ass"]', '2025-06-25 10:56:13.083397', NULL);
INSERT INTO public.messages VALUES ('f74e9a86-b9af-4d7b-98ae-de324fd9463f', '0f9cfb0d-7228-469f-8500-e8a35c7807d8', NULL, 'Kenneth Cole', 'main_doctor', 'team', ' 32rfe', 'text', '[]', '["Kenneth Cole", "ass", "assistant", "def2cfe9-d1a5-4a9b-ae8a-cb953133fa72", "1f6e0c04-708c-425e-b293-fe1f6c8b7709", "asasistent"]', '2025-06-25 10:56:17.011512', NULL);
INSERT INTO public.messages VALUES ('4faa9f8a-bbb5-41d8-a7c1-9357572b9a62', '0f9cfb0d-7228-469f-8500-e8a35c7807d8', NULL, 'Kenneth Cole', 'main_doctor', 'team', 'd qwdd', 'text', '[]', '["Kenneth Cole", "ass", "assistant", "def2cfe9-d1a5-4a9b-ae8a-cb953133fa72", "1f6e0c04-708c-425e-b293-fe1f6c8b7709", "asasistent"]', '2025-06-25 11:02:57.229551', NULL);
INSERT INTO public.messages VALUES ('0af960e3-d6ff-43f9-9449-64538c2499db', 'ad3bc31d-a7e8-41e1-85cd-cc299c68ddf1', NULL, 'ass', 'admin_doctor', 'team', 'asdasd', 'text', '[]', '["ass", "Kenneth Cole"]', '2025-06-25 11:03:09.747815', NULL);
INSERT INTO public.messages VALUES ('beb7f603-e438-459c-afc2-45403b4684b5', '0f9cfb0d-7228-469f-8500-e8a35c7807d8', NULL, 'ass', 'admin_doctor', 'team', 'asdasdasd', 'text', '[]', '["ass", "Kenneth Cole", "assistant", "def2cfe9-d1a5-4a9b-ae8a-cb953133fa72", "1f6e0c04-708c-425e-b293-fe1f6c8b7709", "asasistent"]', '2025-06-25 11:03:05.203911', NULL);
INSERT INTO public.messages VALUES ('d2701d48-aba2-49c2-aaca-d9c2ceb44b2f', '0f9cfb0d-7228-469f-8500-e8a35c7807d8', NULL, 'ass', 'admin_doctor', 'team', 'asdasd', 'text', '[]', '["ass", "Kenneth Cole", "assistant", "def2cfe9-d1a5-4a9b-ae8a-cb953133fa72", "1f6e0c04-708c-425e-b293-fe1f6c8b7709", "asasistent"]', '2025-06-25 01:27:21.978176', NULL);
INSERT INTO public.messages VALUES ('a9d20066-77d0-4ddf-943e-2e3269a4a1db', 'c0e465ca-3cce-45ee-b62d-03e594260803', NULL, 'Kenneth Cole', 'main_doctor', 'team', 'asdwq', 'text', '[]', '["Kenneth Cole", "rese", "assistant", "1f6e0c04-708c-425e-b293-fe1f6c8b7709"]', '2025-06-25 12:24:04.205077', NULL);
INSERT INTO public.messages VALUES ('20a52854-fd5d-477a-ad99-84be2d7020e8', 'c0e465ca-3cce-45ee-b62d-03e594260803', NULL, 'Kenneth Cole', 'main_doctor', 'team', 'asdad', 'text', '[]', '["Kenneth Cole", "rese", "1f6e0c04-708c-425e-b293-fe1f6c8b7709"]', '2025-06-25 12:32:34.254583', NULL);
INSERT INTO public.messages VALUES ('a71ec4f3-ff8e-4b3d-8a18-ecd85786d5ae', 'c0e465ca-3cce-45ee-b62d-03e594260803', NULL, 'Kenneth Cole', 'main_doctor', 'team', 'asdasdsadasd asd', 'text', '[]', '["Kenneth Cole", "1f6e0c04-708c-425e-b293-fe1f6c8b7709"]', '2025-06-25 14:23:40.638789', NULL);
INSERT INTO public.messages VALUES ('cd746f65-0800-476d-9369-d0a91281f0aa', 'c0e465ca-3cce-45ee-b62d-03e594260803', NULL, 'Kenneth Cole', 'main_doctor', 'team', 'fsadfas', 'text', '[]', '["Kenneth Cole", "1f6e0c04-708c-425e-b293-fe1f6c8b7709"]', '2025-06-25 14:23:43.980642', NULL);
INSERT INTO public.messages VALUES ('f218bc49-27aa-493d-b56e-a7970c7f85d9', '146ba707-cdd7-440b-b68d-8a19f38be2ee', NULL, 'ass', 'admin_doctor', 'team', 'asdsad', 'text', '[]', '["ass", "def2cfe9-d1a5-4a9b-ae8a-cb953133fa72", "1f6e0c04-708c-425e-b293-fe1f6c8b7709", "Kenneth Cole", "asasistent"]', '2025-06-25 14:18:05.855035', NULL);
INSERT INTO public.messages VALUES ('64135a4c-6db7-4b5a-91cb-bfcb9e0b4a19', '0f9cfb0d-7228-469f-8500-e8a35c7807d8', NULL, 'ass', 'admin_doctor', 'team', 'dqwdqwd', 'text', '[]', '["ass", "Kenneth Cole", "assistant", "def2cfe9-d1a5-4a9b-ae8a-cb953133fa72", "1f6e0c04-708c-425e-b293-fe1f6c8b7709", "asasistent"]', '2025-06-25 01:24:25.994448', NULL);
INSERT INTO public.messages VALUES ('558aa202-686a-4778-9890-2304da5eec31', '0f9cfb0d-7228-469f-8500-e8a35c7807d8', NULL, 'Kenneth Cole', 'main_doctor', 'team', 'dwqdqwd', 'text', '[]', '["Kenneth Cole", "ass", "assistant", "def2cfe9-d1a5-4a9b-ae8a-cb953133fa72", "1f6e0c04-708c-425e-b293-fe1f6c8b7709", "asasistent"]', '2025-06-25 01:08:38.500788', NULL);
INSERT INTO public.messages VALUES ('7332ea24-d588-4bd8-99e3-778098621c26', '146ba707-cdd7-440b-b68d-8a19f38be2ee', NULL, 'Kenneth Cole', 'main_doctor', 'team', 'hello', 'text', '[]', '["Kenneth Cole", "ass", "rese", "assistant", "def2cfe9-d1a5-4a9b-ae8a-cb953133fa72", "1f6e0c04-708c-425e-b293-fe1f6c8b7709", "asasistent"]', '2025-06-25 11:30:07.997191', NULL);
INSERT INTO public.messages VALUES ('59040199-c6b9-4215-a2b0-f6fa276a012f', '146ba707-cdd7-440b-b68d-8a19f38be2ee', NULL, 'Kenneth Cole', 'main_doctor', 'team', 'hello', 'text', '[]', '["Kenneth Cole", "assistant", "rese", "def2cfe9-d1a5-4a9b-ae8a-cb953133fa72", "1f6e0c04-708c-425e-b293-fe1f6c8b7709", "asasistent"]', '2025-06-25 12:12:46.669571', NULL);
INSERT INTO public.messages VALUES ('fc0f3ca8-1a43-4a37-bd2e-fdf5456d4d67', '0f9cfb0d-7228-469f-8500-e8a35c7807d8', NULL, 'Kenneth Cole', 'main_doctor', 'team', 'ddqwdwqd', 'text', '[]', '["Kenneth Cole", "ass", "assistant", "def2cfe9-d1a5-4a9b-ae8a-cb953133fa72", "1f6e0c04-708c-425e-b293-fe1f6c8b7709", "asasistent"]', '2025-06-25 01:24:14.427582', NULL);
INSERT INTO public.messages VALUES ('b8050de8-d277-4383-a065-6d974eca8273', '0f9cfb0d-7228-469f-8500-e8a35c7807d8', NULL, 'Kenneth Cole', 'main_doctor', 'team', 'dqwdwqd', 'text', '[]', '["Kenneth Cole", "ass", "assistant", "def2cfe9-d1a5-4a9b-ae8a-cb953133fa72", "1f6e0c04-708c-425e-b293-fe1f6c8b7709", "asasistent"]', '2025-06-25 01:24:22.570731', NULL);
INSERT INTO public.messages VALUES ('ece170a1-67a4-4383-8a80-efc0b87a9846', '0f9cfb0d-7228-469f-8500-e8a35c7807d8', NULL, 'Kenneth Cole', 'main_doctor', 'team', 'asdasd', 'text', '[]', '["Kenneth Cole", "def2cfe9-d1a5-4a9b-ae8a-cb953133fa72", "asasistent"]', '2025-06-25 14:35:06.751747', NULL);
INSERT INTO public.messages VALUES ('f80faf12-d10e-4b59-9fbb-8d01805bdf2e', '0f9cfb0d-7228-469f-8500-e8a35c7807d8', NULL, 'Kenneth Cole', 'main_doctor', 'team', 'asdasd', 'text', '[]', '["Kenneth Cole", "def2cfe9-d1a5-4a9b-ae8a-cb953133fa72", "asasistent"]', '2025-06-25 14:35:14.65376', NULL);
INSERT INTO public.messages VALUES ('78b6d3aa-4726-4cdf-853f-6041b06e2508', '146ba707-cdd7-440b-b68d-8a19f38be2ee', NULL, 'asasistent', 'assistant_doctor', 'team', 'asdasdsad', 'text', '[]', '["asasistent", "Kenneth Cole"]', '2025-06-25 14:36:31.213047', NULL);
INSERT INTO public.messages VALUES ('3412b6d1-fd7a-4e81-be2c-591ef1242029', '146ba707-cdd7-440b-b68d-8a19f38be2ee', NULL, 'Kenneth Cole', 'main_doctor', 'team', 'asdasdwq d', 'text', '[]', '["Kenneth Cole", "asasistent"]', '2025-06-25 14:37:04.516709', NULL);
INSERT INTO public.messages VALUES ('50f5c12f-96d5-498e-84f9-73f38086f53f', '146ba707-cdd7-440b-b68d-8a19f38be2ee', NULL, 'asasistent', 'assistant_doctor', 'team', 'asd', 'text', '[]', '["asasistent", "Kenneth Cole"]', '2025-06-25 14:37:10.188899', NULL);
INSERT INTO public.messages VALUES ('e42c3d33-2583-4470-a3fd-e735d85da226', '5b6e2f37-2916-4e92-864b-795a9e866a1e', NULL, 'Kenneth Cole', 'main_doctor', 'team', 'hello doc', 'text', '[]', '["Kenneth Cole", "DR DOC"]', '2025-06-25 15:02:34.757881', NULL);
INSERT INTO public.messages VALUES ('d3aad5c9-c9ad-4ee6-a0aa-f629e706cd88', '5b6e2f37-2916-4e92-864b-795a9e866a1e', NULL, 'DR DOC', 'admin_doctor', 'team', 'hyyy', 'text', '[]', '["DR DOC", "Kenneth Cole"]', '2025-06-25 15:02:46.125953', NULL);
INSERT INTO public.messages VALUES ('ae9419d8-3c74-479b-96db-a459383772a6', '5b6e2f37-2916-4e92-864b-795a9e866a1e', NULL, 'Kenneth Cole', 'main_doctor', 'team', 'hello', 'text', '[]', '["Kenneth Cole", "DR DOC"]', '2025-06-25 15:04:36.621534', NULL);
INSERT INTO public.messages VALUES ('85ec371e-0967-42e9-9967-90b8dcbdfa43', '5b6e2f37-2916-4e92-864b-795a9e866a1e', NULL, 'DR DOC', 'assistant_doctor', 'team', 'dadwd', 'text', '[]', '["DR DOC", "Kenneth Cole"]', '2025-06-25 15:04:47.853448', NULL);
INSERT INTO public.messages VALUES ('5b3b9320-6219-489e-bd9a-3397891fd4d2', '6a3ed352-cc3b-476e-ae27-a06f941af11a', NULL, 'Kenneth Cole', 'main_doctor', 'team', '45634536', 'text', '[]', '["Kenneth Cole", "receptionist", "DR DOCTOR", "Tatiana Peters"]', '2025-06-25 16:23:04.12756', NULL);
INSERT INTO public.messages VALUES ('a3874529-1aaf-4cc4-b741-92c69c8671f5', '14d595ab-7b32-450c-8d58-15ab35c52ca6', NULL, 'Kenneth Cole', 'main_doctor', 'team', 'asdasd', 'text', '[]', '["Kenneth Cole", "receptionist", "DR DOC"]', '2025-06-25 15:06:53.205778', NULL);
INSERT INTO public.messages VALUES ('066215e1-9b1c-4ee1-96a0-ccd4952d419e', '14d595ab-7b32-450c-8d58-15ab35c52ca6', NULL, 'receptionist', 'receptionist', 'team', 'asdasd', 'text', '[]', '["receptionist", "Kenneth Cole", "DR DOC"]', '2025-06-25 15:06:56.981809', NULL);
INSERT INTO public.messages VALUES ('6f35c0e3-702a-4ed1-b13f-f50b8e7c8027', '14d595ab-7b32-450c-8d58-15ab35c52ca6', NULL, 'DR DOC', 'assistant_doctor', 'team', 'asd wq', 'text', '[]', '["DR DOC", "Kenneth Cole", "receptionist"]', '2025-06-25 15:07:15.381323', NULL);
INSERT INTO public.messages VALUES ('22a2088e-3611-4276-9e04-fe7864b63904', '6a3ed352-cc3b-476e-ae27-a06f941af11a', NULL, 'Kenneth Cole', 'main_doctor', 'team', 'wdasd', 'text', '[]', '["Kenneth Cole", "receptionist", "DR DOCTOR", "Tatiana Peters"]', '2025-06-25 16:30:23.688059', NULL);
INSERT INTO public.messages VALUES ('940fca9b-48ac-45ed-be1f-2f522498ff63', '6a3ed352-cc3b-476e-ae27-a06f941af11a', NULL, 'receptionist', 'receptionist', 'team', 'asdasd', 'text', '[]', '["receptionist", "Kenneth Cole", "DR DOCTOR", "Tatiana Peters"]', '2025-06-25 16:30:30.318836', NULL);
INSERT INTO public.messages VALUES ('3f6d6478-120e-4b32-8153-f518da01b689', '6a3ed352-cc3b-476e-ae27-a06f941af11a', NULL, 'Kenneth Cole', 'main_doctor', 'team', 'asdasd', 'text', '[]', '["Kenneth Cole", "receptionist", "DR DOCTOR", "Tatiana Peters"]', '2025-06-25 16:34:20.825133', NULL);
INSERT INTO public.messages VALUES ('720bbd4f-b844-4a8a-9373-e48274f9a18f', '6a3ed352-cc3b-476e-ae27-a06f941af11a', NULL, 'receptionist', 'receptionist', 'team', ' adasd', 'text', '[]', '["receptionist", "Kenneth Cole", "DR DOCTOR", "Tatiana Peters"]', '2025-06-25 17:04:17.782958', NULL);
INSERT INTO public.messages VALUES ('b74e4189-10d9-43f0-bf64-83480ce802e5', '6a3ed352-cc3b-476e-ae27-a06f941af11a', NULL, 'receptionist', 'receptionist', 'team', ' asd', 'text', '[]', '["receptionist", "Kenneth Cole", "DR DOCTOR", "Tatiana Peters"]', '2025-06-25 17:04:30.207088', NULL);
INSERT INTO public.messages VALUES ('b3c51122-03fe-4b86-8535-7263745c5a7c', '6a3ed352-cc3b-476e-ae27-a06f941af11a', NULL, 'receptionist', 'receptionist', 'team', 'hghh', 'text', '[]', '["receptionist", "Kenneth Cole", "DR DOCTOR", "Tatiana Peters"]', '2025-06-25 18:22:40.294953', NULL);
INSERT INTO public.messages VALUES ('e85d67cc-0802-4162-9874-270578b23684', '6a3ed352-cc3b-476e-ae27-a06f941af11a', NULL, 'Kenneth Cole', 'main_doctor', 'team', ' ads awq3', 'text', '[]', '["Kenneth Cole", "receptionist", "DR DOCTOR", "Tatiana Peters"]', '2025-06-25 18:23:13.077587', NULL);
INSERT INTO public.messages VALUES ('0a036a32-ee50-4a62-9240-91ac3ca7f9a2', '6a3ed352-cc3b-476e-ae27-a06f941af11a', NULL, 'DR DOCTOR', 'assistant_doctor', 'team', 'hello', 'text', '[]', '["DR DOCTOR", "receptionist", "Kenneth Cole", "Tatiana Peters"]', '2025-06-25 18:35:34.469526', NULL);
INSERT INTO public.messages VALUES ('e1793c07-adc5-49f3-823d-cc6e5f0fa453', '6a3ed352-cc3b-476e-ae27-a06f941af11a', NULL, 'DR DOCTOR', 'assistant_doctor', 'team', 's as', 'text', '[]', '["DR DOCTOR", "receptionist", "Kenneth Cole", "Tatiana Peters"]', '2025-06-25 18:34:13.630043', NULL);
INSERT INTO public.messages VALUES ('1fd707d9-3c1b-43cc-a333-78e507c9c525', '6a3ed352-cc3b-476e-ae27-a06f941af11a', NULL, 'receptionist', 'receptionist', 'team', ' rq', 'text', '[]', '["receptionist", "DR DOCTOR", "Kenneth Cole", "Tatiana Peters"]', '2025-06-25 18:34:21.246046', NULL);
INSERT INTO public.messages VALUES ('dd16242d-47e6-49eb-b5c3-53e86bb355d8', '6a3ed352-cc3b-476e-ae27-a06f941af11a', NULL, 'Kenneth Cole', 'main_doctor', 'team', 'asdwqd qw', 'text', '[]', '["Kenneth Cole", "receptionist", "DR DOCTOR", "Tatiana Peters"]', '2025-06-25 17:01:38.218168', NULL);
INSERT INTO public.messages VALUES ('f0826fb4-50b8-48b0-b325-a2239b4d5b79', '6a3ed352-cc3b-476e-ae27-a06f941af11a', NULL, 'DR DOC', 'assistant_doctor', 'team', 'asdq w', 'text', '[]', '["DR DOC", "Kenneth Cole", "receptionist", "DR DOCTOR", "Tatiana Peters"]', '2025-06-25 15:18:56.623303', NULL);
INSERT INTO public.messages VALUES ('0ba9c561-2a58-46cf-ad8e-bfec0f5c1ed1', '6a3ed352-cc3b-476e-ae27-a06f941af11a', NULL, 'receptionist', 'receptionist', 'team', 'wq1', 'text', '[]', '["receptionist", "Kenneth Cole", "DR DOCTOR", "Tatiana Peters"]', '2025-06-25 16:26:03.328674', NULL);
INSERT INTO public.messages VALUES ('d83283c3-2a84-429c-b9f0-3f4d238aa5d1', 'dd3b3509-87f5-42a7-b6d6-ea4ad15f1e3f', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'ddwed', 'text', '[]', '["Xaviera Knight", "dr Jens", "test", "Tatiana Peters"]', '2025-06-26 15:22:32.14273', NULL);
INSERT INTO public.messages VALUES ('e4a3687f-811e-40af-8d74-a832625085b8', '6a3ed352-cc3b-476e-ae27-a06f941af11a', NULL, 'receptionist', 'receptionist', 'team', 'dasdasd', 'text', '[]', '["receptionist", "Kenneth Cole", "DR DOCTOR", "Tatiana Peters"]', '2025-06-25 16:23:13.47074', NULL);
INSERT INTO public.messages VALUES ('85055b42-7bb3-4a89-b7d0-8c36bcefa9aa', '6a3ed352-cc3b-476e-ae27-a06f941af11a', NULL, 'receptionist', 'receptionist', 'team', 'ASDASD', 'text', '[]', '["receptionist", "Kenneth Cole", "DR DOCTOR", "Tatiana Peters"]', '2025-06-25 16:25:10.525739', NULL);
INSERT INTO public.messages VALUES ('7d5a024f-9fdb-4004-b6d7-f3f2e46433b5', '6a3ed352-cc3b-476e-ae27-a06f941af11a', NULL, 'receptionist', 'receptionist', 'team', 'asdasd', 'text', '[]', '["receptionist", "Kenneth Cole", "DR DOCTOR", "Tatiana Peters"]', '2025-06-25 16:34:25.695082', NULL);
INSERT INTO public.messages VALUES ('75cb98c8-f761-493a-95f4-d20bbce58435', '6a3ed352-cc3b-476e-ae27-a06f941af11a', NULL, 'Kenneth Cole', 'main_doctor', 'team', 'asdad', 'text', '[]', '["Kenneth Cole", "receptionist", "DR DOCTOR", "Tatiana Peters"]', '2025-06-25 16:56:18.848139', NULL);
INSERT INTO public.messages VALUES ('d8ffe92c-c250-436a-bfb2-f8ae35df8cb3', '6a3ed352-cc3b-476e-ae27-a06f941af11a', NULL, 'receptionist', 'receptionist', 'team', 'dqwdqwd', 'text', '[]', '["receptionist", "Kenneth Cole", "DR DOCTOR", "Tatiana Peters"]', '2025-06-25 16:58:32.967819', NULL);
INSERT INTO public.messages VALUES ('38e51fc5-945c-4d59-958d-161f9b4def5c', '6a3ed352-cc3b-476e-ae27-a06f941af11a', NULL, 'Kenneth Cole', 'main_doctor', 'team', 'dwqdwqd', 'text', '[]', '["Kenneth Cole", "receptionist", "DR DOCTOR", "Tatiana Peters"]', '2025-06-25 16:58:38.862571', NULL);
INSERT INTO public.messages VALUES ('c0c9e96e-9bcc-4f9c-9131-d7d436afdd33', '6a3ed352-cc3b-476e-ae27-a06f941af11a', NULL, 'receptionist', 'receptionist', 'team', ' sdasd', 'text', '[]', '["receptionist", "Kenneth Cole", "DR DOCTOR", "Tatiana Peters"]', '2025-06-25 17:02:46.733861', NULL);
INSERT INTO public.messages VALUES ('b5692cad-0a13-4371-8fcc-fc46de3a0353', '6a3ed352-cc3b-476e-ae27-a06f941af11a', NULL, 'receptionist', 'receptionist', 'team', ' asd', 'text', '[]', '["receptionist", "Kenneth Cole", "DR DOCTOR", "Tatiana Peters"]', '2025-06-25 17:02:52.666072', NULL);
INSERT INTO public.messages VALUES ('38db6085-6ce5-4e71-b961-1ef724dfee2a', '6a3ed352-cc3b-476e-ae27-a06f941af11a', NULL, 'Kenneth Cole', 'main_doctor', 'team', 'da sdasd', 'text', '[]', '["Kenneth Cole", "receptionist", "DR DOCTOR", "Tatiana Peters"]', '2025-06-25 17:02:37.790693', NULL);
INSERT INTO public.messages VALUES ('adaf3d7d-372d-4d8f-b03f-4be3bab639ce', '3ee4cdd2-c111-4df4-a10d-7b396f236eca', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'hi', 'text', '[]', '["Xaviera Knight"]', '2025-06-26 17:28:13.678958', NULL);
INSERT INTO public.messages VALUES ('5b158159-e47c-4d84-8d01-8db119c0bff5', 'dd3b3509-87f5-42a7-b6d6-ea4ad15f1e3f', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'asdasdasd', 'text', '[]', '["Xaviera Knight", "test", "Tatiana Peters"]', '2025-06-26 18:37:03.390057', NULL);
INSERT INTO public.messages VALUES ('c70286b7-56d2-47be-a358-b984e50aa52c', 'dd3b3509-87f5-42a7-b6d6-ea4ad15f1e3f', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'asdasdasd', 'text', '[]', '["Xaviera Knight", "test", "Tatiana Peters"]', '2025-06-26 18:37:05.622711', NULL);
INSERT INTO public.messages VALUES ('f087c374-1d41-4ae4-9333-350606307be3', 'dd3b3509-87f5-42a7-b6d6-ea4ad15f1e3f', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'dasdasd', 'text', '[]', '["Xaviera Knight", "test", "Tatiana Peters"]', '2025-06-26 18:37:12.510675', NULL);
INSERT INTO public.messages VALUES ('cd190c24-b145-47a5-b751-7ce01e7587c4', 'dd3b3509-87f5-42a7-b6d6-ea4ad15f1e3f', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'sad asdsa', 'text', '[]', '["Xaviera Knight", "test", "Tatiana Peters"]', '2025-06-26 18:37:14.174854', NULL);
INSERT INTO public.messages VALUES ('01742f76-54e9-4e1a-9cdf-691dc5962e8b', 'dd3b3509-87f5-42a7-b6d6-ea4ad15f1e3f', NULL, 'Xaviera Knight', 'main_doctor', 'team', ' awdawdawd', 'text', '[]', '["Xaviera Knight", "test", "Tatiana Peters"]', '2025-06-26 19:19:44.071773', NULL);
INSERT INTO public.messages VALUES ('13be0f1a-0e37-45c4-93c3-3aa10a847d23', 'dd3b3509-87f5-42a7-b6d6-ea4ad15f1e3f', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'w', 'text', '[]', '["Xaviera Knight", "test", "Tatiana Peters"]', '2025-06-26 19:19:44.278345', NULL);
INSERT INTO public.messages VALUES ('08f1e489-997c-4c92-95c0-8ae99a73197a', 'dd3b3509-87f5-42a7-b6d6-ea4ad15f1e3f', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'efd ', 'text', '[]', '["Xaviera Knight", "test", "Tatiana Peters"]', '2025-06-26 19:19:44.478541', NULL);
INSERT INTO public.messages VALUES ('1081dd6d-73ff-40ad-883e-05f9a96fea7b', '26026a47-613a-49a9-a5db-3e6502a8e009', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'hello', 'text', '[]', '["Xaviera Knight", "dr Jens", "Tatiana Peters"]', '2025-06-25 18:46:23.741536', NULL);
INSERT INTO public.messages VALUES ('a0a74137-f489-4074-9024-c095e4d800ca', 'dd3b3509-87f5-42a7-b6d6-ea4ad15f1e3f', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'wef ', 'text', '[]', '["Xaviera Knight", "test", "Tatiana Peters"]', '2025-06-26 19:19:44.686626', NULL);
INSERT INTO public.messages VALUES ('88cfd2d6-ae35-487a-b991-feb244a20e25', 'dd3b3509-87f5-42a7-b6d6-ea4ad15f1e3f', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'wer', 'text', '[]', '["Xaviera Knight", "test", "Tatiana Peters"]', '2025-06-26 19:19:44.903039', NULL);
INSERT INTO public.messages VALUES ('43d40ef7-c790-4a63-9bd5-7bf6cbfc05ae', 'dd3b3509-87f5-42a7-b6d6-ea4ad15f1e3f', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'fwe', 'text', '[]', '["Xaviera Knight", "test", "Tatiana Peters"]', '2025-06-26 19:19:45.045869', NULL);
INSERT INTO public.messages VALUES ('5885d43b-043f-4d4d-a204-bc89ece90277', 'dd3b3509-87f5-42a7-b6d6-ea4ad15f1e3f', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'f', 'text', '[]', '["Xaviera Knight", "test", "Tatiana Peters"]', '2025-06-26 19:19:45.214797', NULL);
INSERT INTO public.messages VALUES ('96d5a8d0-2258-4548-9e71-e85f8ae3f55c', 'dd3b3509-87f5-42a7-b6d6-ea4ad15f1e3f', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'ef', 'text', '[]', '["Xaviera Knight", "test", "Tatiana Peters"]', '2025-06-26 19:19:46.118844', NULL);
INSERT INTO public.messages VALUES ('b503c1da-c089-480a-ac3d-58b5df10628c', 'dd3b3509-87f5-42a7-b6d6-ea4ad15f1e3f', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'ew', 'text', '[]', '["Xaviera Knight", "test", "Tatiana Peters"]', '2025-06-26 19:19:46.869626', NULL);
INSERT INTO public.messages VALUES ('86d95160-7353-48a6-b1f8-834160732524', 'dd3b3509-87f5-42a7-b6d6-ea4ad15f1e3f', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'fwe', 'text', '[]', '["Xaviera Knight", "test", "Tatiana Peters"]', '2025-06-26 19:19:47.074095', NULL);
INSERT INTO public.messages VALUES ('b80dbdd9-c15e-4aea-b9fd-945852d65e99', 'dd3b3509-87f5-42a7-b6d6-ea4ad15f1e3f', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'f', 'text', '[]', '["Xaviera Knight", "test", "Tatiana Peters"]', '2025-06-26 19:19:47.254075', NULL);
INSERT INTO public.messages VALUES ('d006edac-8866-4ff7-afbc-198e2c791069', 'dd3b3509-87f5-42a7-b6d6-ea4ad15f1e3f', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'wef', 'text', '[]', '["Xaviera Knight", "test", "Tatiana Peters"]', '2025-06-26 19:19:47.478638', NULL);
INSERT INTO public.messages VALUES ('62c3d2b5-0a11-4ca4-8bd1-5e33794c3754', 'dd3b3509-87f5-42a7-b6d6-ea4ad15f1e3f', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'ewfwe', 'text', '[]', '["Xaviera Knight", "test", "Tatiana Peters"]', '2025-06-26 19:19:47.830559', NULL);
INSERT INTO public.messages VALUES ('299514f5-05a3-4209-a623-23d42ad93f04', 'dd3b3509-87f5-42a7-b6d6-ea4ad15f1e3f', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'fwe', 'text', '[]', '["Xaviera Knight", "test", "Tatiana Peters"]', '2025-06-26 19:19:48.061193', NULL);
INSERT INTO public.messages VALUES ('49152b61-0103-4020-b55e-b7f50c9a43f5', 'dd3b3509-87f5-42a7-b6d6-ea4ad15f1e3f', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'wef', 'text', '[]', '["Xaviera Knight", "test", "Tatiana Peters"]', '2025-06-26 19:19:48.510777', NULL);
INSERT INTO public.messages VALUES ('887b5def-0917-47c5-8bf3-2a114561b48a', 'dd3b3509-87f5-42a7-b6d6-ea4ad15f1e3f', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'w', 'text', '[]', '["Xaviera Knight", "test", "Tatiana Peters"]', '2025-06-26 19:19:49.082988', NULL);
INSERT INTO public.messages VALUES ('b5fec317-1cb0-4a8c-b196-70e6e4127f3f', 'dd3b3509-87f5-42a7-b6d6-ea4ad15f1e3f', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'wef', 'text', '[]', '["Xaviera Knight", "test", "Tatiana Peters"]', '2025-06-26 19:19:45.583625', NULL);
INSERT INTO public.messages VALUES ('18878370-47ff-4ccf-9aec-d268f8437312', 'dd3b3509-87f5-42a7-b6d6-ea4ad15f1e3f', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'f', 'text', '[]', '["Xaviera Knight", "test", "Tatiana Peters"]', '2025-06-26 19:19:48.287753', NULL);
INSERT INTO public.messages VALUES ('930d4578-2a01-4c38-92d1-da6eed6251bd', 'dd3b3509-87f5-42a7-b6d6-ea4ad15f1e3f', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'wef', 'text', '[]', '["Xaviera Knight", "test", "Tatiana Peters"]', '2025-06-26 19:19:48.71811', NULL);
INSERT INTO public.messages VALUES ('08e2031c-0cda-4cdc-9295-21accff3c7f7', 'dd3b3509-87f5-42a7-b6d6-ea4ad15f1e3f', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'wef', 'text', '[]', '["Xaviera Knight", "test", "Tatiana Peters"]', '2025-06-26 19:19:48.922104', NULL);
INSERT INTO public.messages VALUES ('e735bf46-0c34-4bd1-819e-5687285aa2f0', 'dd3b3509-87f5-42a7-b6d6-ea4ad15f1e3f', NULL, 'test', 'assistant_doctor', 'team', 'hello', 'text', '[]', '["test", "Xaviera Knight", "Tatiana Peters"]', '2025-06-26 21:05:39.847792', NULL);
INSERT INTO public.messages VALUES ('8fe8e1f1-f298-410a-891d-b13cc5aed36e', '26026a47-613a-49a9-a5db-3e6502a8e009', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'sad', 'text', '[]', '["Xaviera Knight", "Tatiana Peters"]', '2025-06-26 00:25:41.291438', NULL);
INSERT INTO public.messages VALUES ('3fac3731-4de4-44e8-b39f-d9ebbc81bb43', '6a3ed352-cc3b-476e-ae27-a06f941af11a', NULL, 'Kenneth Cole', 'main_doctor', 'team', ' adqwd d', 'text', '[]', '["Kenneth Cole", "receptionist", "DR DOCTOR", "Tatiana Peters"]', '2025-06-25 17:04:23.49486', NULL);
INSERT INTO public.messages VALUES ('9b2e5b5d-d763-4138-9330-a22fa9682bce', '6a3ed352-cc3b-476e-ae27-a06f941af11a', NULL, 'receptionist', 'receptionist', 'team', 'asdasd', 'text', '[]', '["receptionist", "Kenneth Cole", "DR DOCTOR", "Tatiana Peters"]', '2025-06-25 16:25:58.682072', NULL);
INSERT INTO public.messages VALUES ('0f3f073c-341f-4b59-9842-50050eaca9a5', '9380715b-0553-428c-a284-3b2ac7983d9b', NULL, 'Tatiana Peters', 'main_doctor', 'team', 'wqdqwd', 'text', '[]', '["Tatiana Peters"]', '2025-07-04 17:23:31.652783', NULL);
INSERT INTO public.messages VALUES ('e0b9341b-81a5-4d19-9ce7-aa9d4e96b37d', '11635e1c-ce51-47de-97f7-759eff29f249', NULL, 'Chelsea Walters', 'admin_doctor', 'team', 'da', 'text', '[]', '["Chelsea Walters", "Xaviera Knight", "Tatiana Peters"]', '2025-07-01 01:16:50.485562', NULL);
INSERT INTO public.messages VALUES ('578fb61f-5b9c-4b11-9cee-5819458b1914', '11635e1c-ce51-47de-97f7-759eff29f249', NULL, 'Chelsea Walters', 'admin_doctor', 'team', 'd', 'text', '[]', '["Chelsea Walters", "Xaviera Knight", "Tatiana Peters"]', '2025-07-01 01:16:50.634637', NULL);
INSERT INTO public.messages VALUES ('b2b2e737-e776-4213-9190-a4be06f4b4fc', '11635e1c-ce51-47de-97f7-759eff29f249', NULL, 'Chelsea Walters', 'admin_doctor', 'team', 'asd', 'text', '[]', '["Chelsea Walters", "Xaviera Knight", "Tatiana Peters"]', '2025-07-01 01:16:50.795769', NULL);
INSERT INTO public.messages VALUES ('d5a4b452-819f-4eff-b652-179d9f2e5e1c', '11635e1c-ce51-47de-97f7-759eff29f249', NULL, 'Chelsea Walters', 'admin_doctor', 'team', 'asd', 'text', '[]', '["Chelsea Walters", "Xaviera Knight", "Tatiana Peters"]', '2025-07-01 01:16:50.956451', NULL);
INSERT INTO public.messages VALUES ('37bf7903-3378-4405-bbdf-67a2ce53f1d2', '11635e1c-ce51-47de-97f7-759eff29f249', NULL, 'Chelsea Walters', 'admin_doctor', 'team', 'd', 'text', '[]', '["Chelsea Walters", "Xaviera Knight", "Tatiana Peters"]', '2025-07-01 01:16:53.099302', NULL);
INSERT INTO public.messages VALUES ('1186c4ca-85eb-4e33-a27d-5334c749893b', 'dd3b3509-87f5-42a7-b6d6-ea4ad15f1e3f', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'sadasd', 'text', '[]', '["Xaviera Knight", "test", "Tatiana Peters"]', '2025-06-26 18:36:59.256725', NULL);
INSERT INTO public.messages VALUES ('d8fd77e4-034d-4b4b-b6d8-e8493797ffed', 'dd3b3509-87f5-42a7-b6d6-ea4ad15f1e3f', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'asdasdsad', 'text', '[]', '["Xaviera Knight", "test", "Tatiana Peters"]', '2025-06-26 18:37:01.614715', NULL);
INSERT INTO public.messages VALUES ('ab629c71-a827-48bd-9d01-a8f46cfddccf', 'dd3b3509-87f5-42a7-b6d6-ea4ad15f1e3f', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'wef', 'text', '[]', '["Xaviera Knight", "test", "Tatiana Peters"]', '2025-06-26 19:19:45.398407', NULL);
INSERT INTO public.messages VALUES ('2838737c-c0c6-41f9-818c-a3edd045c081', 'dd3b3509-87f5-42a7-b6d6-ea4ad15f1e3f', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'we', 'text', '[]', '["Xaviera Knight", "test", "Tatiana Peters"]', '2025-06-26 19:19:45.774575', NULL);
INSERT INTO public.messages VALUES ('7cf978c1-bc4d-4cad-8dd0-ed2c39344e33', 'dd3b3509-87f5-42a7-b6d6-ea4ad15f1e3f', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'fw', 'text', '[]', '["Xaviera Knight", "test", "Tatiana Peters"]', '2025-06-26 19:19:45.942162', NULL);
INSERT INTO public.messages VALUES ('7d1d03a8-3c03-422e-b7cf-5423ac188ffb', 'dd3b3509-87f5-42a7-b6d6-ea4ad15f1e3f', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'wef', 'text', '[]', '["Xaviera Knight", "test", "Tatiana Peters"]', '2025-06-26 19:19:46.30363', NULL);
INSERT INTO public.messages VALUES ('8a43f8a5-e30c-4c6e-8754-eeee5588d860', 'dd3b3509-87f5-42a7-b6d6-ea4ad15f1e3f', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'wef', 'text', '[]', '["Xaviera Knight", "test", "Tatiana Peters"]', '2025-06-26 19:19:46.502574', NULL);
INSERT INTO public.messages VALUES ('1fc6aca8-499f-4556-a465-62b9cf539f2b', 'dd3b3509-87f5-42a7-b6d6-ea4ad15f1e3f', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'wef', 'text', '[]', '["Xaviera Knight", "test", "Tatiana Peters"]', '2025-06-26 19:19:46.712488', NULL);
INSERT INTO public.messages VALUES ('18182c83-6c15-44b1-8f5c-2ea2edebc076', '80dc4a89-7fb2-441f-9dd9-0384d18b9092', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'sad', 'text', '[]', '["Xaviera Knight", "Tatiana Peters"]', '2025-07-01 01:17:07.418606', NULL);
INSERT INTO public.messages VALUES ('90ea77db-f12f-40e2-bc73-a74f1067f6af', '80dc4a89-7fb2-441f-9dd9-0384d18b9092', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'sad', 'text', '[]', '["Xaviera Knight", "Tatiana Peters"]', '2025-07-01 01:17:07.580116', NULL);
INSERT INTO public.messages VALUES ('68ffd504-650a-413d-b8bf-905117120960', '80dc4a89-7fb2-441f-9dd9-0384d18b9092', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'sa', 'text', '[]', '["Xaviera Knight", "Tatiana Peters"]', '2025-07-01 01:17:07.746015', NULL);
INSERT INTO public.messages VALUES ('3521313a-e6fd-4221-8a00-d1817583daab', '80dc4a89-7fb2-441f-9dd9-0384d18b9092', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'da', 'text', '[]', '["Xaviera Knight", "Tatiana Peters"]', '2025-07-01 01:17:07.897957', NULL);
INSERT INTO public.messages VALUES ('453406cc-2457-459e-8086-cec88fde39dc', '80dc4a89-7fb2-441f-9dd9-0384d18b9092', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'sd', 'text', '[]', '["Xaviera Knight", "Tatiana Peters"]', '2025-07-01 01:17:08.070433', NULL);
INSERT INTO public.messages VALUES ('9ca9f529-08e1-4d6c-863b-1f4a005316f3', '80dc4a89-7fb2-441f-9dd9-0384d18b9092', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'asd', 'text', '[]', '["Xaviera Knight", "Tatiana Peters"]', '2025-07-01 01:17:08.218845', NULL);
INSERT INTO public.messages VALUES ('ec59d61d-f1f2-404c-ab86-e3b6308031a3', '80dc4a89-7fb2-441f-9dd9-0384d18b9092', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'asd', 'text', '[]', '["Xaviera Knight", "Tatiana Peters"]', '2025-07-01 01:17:08.38615', NULL);
INSERT INTO public.messages VALUES ('bdce09c2-f025-47ef-80bb-55b528765c9d', '80dc4a89-7fb2-441f-9dd9-0384d18b9092', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'a', 'text', '[]', '["Xaviera Knight", "Tatiana Peters"]', '2025-07-01 01:17:08.529768', NULL);
INSERT INTO public.messages VALUES ('588176d1-2336-4467-aff3-851cb9c93329', '80dc4a89-7fb2-441f-9dd9-0384d18b9092', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'sd', 'text', '[]', '["Xaviera Knight", "Tatiana Peters"]', '2025-07-01 01:17:08.69096', NULL);
INSERT INTO public.messages VALUES ('181988c5-6069-4858-b830-95eb874881da', '80dc4a89-7fb2-441f-9dd9-0384d18b9092', NULL, 'Xaviera Knight', 'main_doctor', 'team', 'asd', 'text', '[]', '["Xaviera Knight", "Tatiana Peters"]', '2025-07-01 01:17:08.849614', NULL);
INSERT INTO public.messages VALUES ('c3519cfa-2bc5-4684-876d-30da484e3a4b', '11635e1c-ce51-47de-97f7-759eff29f249', NULL, 'Chelsea Walters', 'admin_doctor', 'team', 'asdfsdad', 'text', '[]', '["Chelsea Walters", "Xaviera Knight", "Tatiana Peters"]', '2025-07-01 00:42:45.660497', NULL);
INSERT INTO public.messages VALUES ('0d3066fb-fc11-4321-82be-d625cd2223f3', '11635e1c-ce51-47de-97f7-759eff29f249', NULL, 'Chelsea Walters', 'admin_doctor', 'team', 'sadasd', 'text', '[]', '["Chelsea Walters", "Xaviera Knight", "Tatiana Peters"]', '2025-07-01 00:42:51.284332', NULL);
INSERT INTO public.messages VALUES ('27646dd8-d014-4b0c-8839-4d322e0b6bbc', '11635e1c-ce51-47de-97f7-759eff29f249', NULL, 'Chelsea Walters', 'admin_doctor', 'team', 'as', 'text', '[]', '["Chelsea Walters", "Xaviera Knight", "Tatiana Peters"]', '2025-07-01 01:16:51.098171', NULL);
INSERT INTO public.messages VALUES ('1b1cb692-178c-49a9-bf2e-5e86029727db', '11635e1c-ce51-47de-97f7-759eff29f249', NULL, 'Chelsea Walters', 'admin_doctor', 'team', 'ASDASD', 'text', '[]', '["Chelsea Walters", "Xaviera Knight", "Tatiana Peters"]', '2025-07-01 00:49:17.428308', NULL);
INSERT INTO public.messages VALUES ('b5342afc-2e0b-4d5f-97e3-5e3f5cca4cfd', '11635e1c-ce51-47de-97f7-759eff29f249', NULL, 'Chelsea Walters', 'admin_doctor', 'team', 'dasdasd', 'text', '[]', '["Chelsea Walters", "Xaviera Knight", "Tatiana Peters"]', '2025-07-01 01:16:49.781471', NULL);
INSERT INTO public.messages VALUES ('13b9f074-d0eb-43f3-b974-1e57486c5c64', '11635e1c-ce51-47de-97f7-759eff29f249', NULL, 'Chelsea Walters', 'admin_doctor', 'team', 'asd', 'text', '[]', '["Chelsea Walters", "Xaviera Knight", "Tatiana Peters"]', '2025-07-01 01:16:49.970894', NULL);
INSERT INTO public.messages VALUES ('ef9573d3-5f16-4749-8f5d-cf03b906b34b', '11635e1c-ce51-47de-97f7-759eff29f249', NULL, 'Chelsea Walters', 'admin_doctor', 'team', 'asd', 'text', '[]', '["Chelsea Walters", "Xaviera Knight", "Tatiana Peters"]', '2025-07-01 01:16:50.159427', NULL);
INSERT INTO public.messages VALUES ('39d6dd74-c053-4c3e-a36f-80729303e9d8', '11635e1c-ce51-47de-97f7-759eff29f249', NULL, 'Chelsea Walters', 'admin_doctor', 'team', 'as', 'text', '[]', '["Chelsea Walters", "Xaviera Knight", "Tatiana Peters"]', '2025-07-01 01:16:50.321799', NULL);
INSERT INTO public.messages VALUES ('138cdb4d-483b-4435-a7b5-abd861e2cd84', '72417e64-46fd-48d4-9715-2d437dea6461', NULL, 'ASd', 'assistant_doctor', 'team', 'asdasd', 'text', '[]', '["ASd", "conasd Peters"]', '2025-07-08 03:13:04.545187', NULL);


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.orders VALUES ('707f3378-a26f-490b-9076-f79967912f28', 'new', 'fixed-restoration', 'DEXTER', 'PACHECO', '63', 'male', 'Jana Cameron', '5599669966', 'Voluptatibus dolorem', '2', 'digital', 'fixed-restoration', 'crown', NULL, NULL, NULL, NULL, '[{"type": "abutment", "shadeGuide": {"type": "anterior", "shades": ["A1 - Vita Classic", "A3 - Vita Classic", "2L2.5 - Vita 3D Master"]}, "shadeNotes": "this is a shade", "productName": ["E-max Crown", "Zirconia Crown"], "toothNumber": 12, "productDetails": {"notes": "", "shade": "A3.5 - Vita Classic", "trial": "metal", "shadeGuide": {"type": "anterior", "shades": ["A1 - Vita Classic", "A3 - Vita Classic", "2L2.5 - Vita 3D Master"]}, "shadeNotes": "this is a shade", "productName": ["E-max Crown", "Zirconia Crown"], "ponticDesign": "Saddle", "occlusalStaining": "heavy"}, "subcategoryType": "crown", "occlusalStaining": "heavy", "prescriptionType": "fixed-restoration", "selectedProducts": [{"id": "550e8400-e29b-41d4-a716-446655440001", "name": "E-max Crown", "category": "Crown", "material": "Lithium Disilicate", "quantity": 3, "description": "Esthetic lithium disilicate crown for anterior teeth"}, {"id": "550e8400-e29b-41d4-a716-446655440000", "name": "Zirconia Crown", "category": "Crown", "material": "Zirconia", "quantity": 3, "description": "High-strength zirconia crown for posterior teeth"}], "trialRequirements": "metal"}]', '[{"groupType": "joint", "shadeGuide": {"type": "anterior", "shades": ["A1 - Vita Classic", "A3 - Vita Classic", "2L2.5 - Vita 3D Master"]}, "shadeNotes": "this is a shade", "ponticDesign": "Saddle", "shadeDetails": "A3.5 - Vita Classic", "teethDetails": [[{"type": "abutment", "productName": ["E-max Crown", "Zirconia Crown"], "teethNumber": 21, "toothNumber": 21, "productDetails": {"notes": "", "shade": "A3.5 - Vita Classic", "trial": "metal", "quantity": 3, "shadeGuide": {"type": "anterior", "shades": ["A1 - Vita Classic", "A3 - Vita Classic", "2L2.5 - Vita 3D Master"]}, "shadeNotes": "this is a shade", "productName": ["E-max Crown", "Zirconia Crown"], "ponticDesign": "Saddle", "occlusalStaining": "heavy"}, "productQuantity": 1, "selectedProducts": [{"id": "550e8400-e29b-41d4-a716-446655440001", "name": "E-max Crown", "category": "Crown", "material": "Lithium Disilicate", "quantity": 3, "description": "Esthetic lithium disilicate crown for anterior teeth"}, {"id": "550e8400-e29b-41d4-a716-446655440000", "name": "Zirconia Crown", "category": "Crown", "material": "Zirconia", "quantity": 3, "description": "High-strength zirconia crown for posterior teeth"}]}, {"type": "abutment", "productName": ["E-max Crown", "Zirconia Crown"], "teethNumber": 11, "toothNumber": 11, "productDetails": {"notes": "", "shade": "A3.5 - Vita Classic", "trial": "metal", "quantity": 3, "shadeGuide": {"type": "anterior", "shades": ["A1 - Vita Classic", "A3 - Vita Classic", "2L2.5 - Vita 3D Master"]}, "shadeNotes": "this is a shade", "productName": ["E-max Crown", "Zirconia Crown"], "ponticDesign": "Saddle", "occlusalStaining": "heavy"}, "productQuantity": 1, "selectedProducts": [{"id": "550e8400-e29b-41d4-a716-446655440001", "name": "E-max Crown", "category": "Crown", "material": "Lithium Disilicate", "quantity": 3, "description": "Esthetic lithium disilicate crown for anterior teeth"}, {"id": "550e8400-e29b-41d4-a716-446655440000", "name": "Zirconia Crown", "category": "Crown", "material": "Zirconia", "quantity": 3, "description": "High-strength zirconia crown for posterior teeth"}]}]], "occlusalStaining": "heavy", "prescriptionType": "fixed-restoration", "trialRequirements": "metal"}]', NULL, '{"product": [{"name": "", "provider": ""}], "quantity": 0, "abutmentType": ""}', '2ef6b59d-3738-4672-9a86-c33b606251f8', NULL, '[{"product": "E-max Crown", "quantity": 3}, {"product": "Zirconia Crown", "quantity": 3}]', NULL, 'medium', NULL, NULL, NULL, NULL, false, NULL, NULL, NULL, NULL, NULL, NULL, '{"notes": "", "scanDate": "", "scanTime": "", "trackingId": "", "courierName": "", "areaManagerId": ""}', NULL, NULL, NULL, NULL, false, false, '[]', '[]', '[]', '[]', '2025-07-13 03:27:23.614145', 'ORD-25-21022', 'REF-1752357443454-ZZAQ', '10', false, 'INR', NULL, 'Standard', 'pending', 'active', 'Crate-99320', 'this is a additional note', NULL);


--
-- Data for Name: patients; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.patients VALUES (106, 'Aarav', 'Bansal', '32', 'Male', NULL, '2025-06-13 14:11:55.954864');
INSERT INTO public.patients VALUES (107, 'Divya', 'Patel', '28', 'Female', NULL, '2025-06-13 14:11:56.19364');
INSERT INTO public.patients VALUES (108, ' Rohan', 'Sharma', '45', 'Male', NULL, '2025-06-13 14:11:56.424216');
INSERT INTO public.patients VALUES (109, 'Priya', 'Verma', '30', 'Female', NULL, '2025-06-13 14:11:56.653204');
INSERT INTO public.patients VALUES (110, 'Amit', 'Kumar', '38', 'Male', NULL, '2025-06-13 14:11:56.882325');
INSERT INTO public.patients VALUES (111, 'Aarav', 'Bansal', '32', 'Male', NULL, '2025-06-13 14:13:48.860105');
INSERT INTO public.patients VALUES (112, 'Divya', 'Patel', '28', 'Female', NULL, '2025-06-13 14:13:49.087189');
INSERT INTO public.patients VALUES (113, ' Rohan', 'Sharma', '45', 'Male', NULL, '2025-06-13 14:13:49.313704');
INSERT INTO public.patients VALUES (114, 'Priya', 'Verma', '30', 'Female', NULL, '2025-06-13 14:13:49.540532');
INSERT INTO public.patients VALUES (115, 'Amit', 'Kumar', '38', 'Male', NULL, '2025-06-13 14:13:49.767236');
INSERT INTO public.patients VALUES (116, 'Aarav', 'Bansal', '32', 'Male', NULL, '2025-06-13 14:13:54.729137');
INSERT INTO public.patients VALUES (117, 'Divya', 'Patel', '28', 'Female', NULL, '2025-06-13 14:13:54.957503');
INSERT INTO public.patients VALUES (118, ' Rohan', 'Sharma', '45', 'Male', NULL, '2025-06-13 14:13:55.185457');
INSERT INTO public.patients VALUES (119, 'Priya', 'Verma', '30', 'Female', NULL, '2025-06-13 14:13:55.41345');
INSERT INTO public.patients VALUES (120, 'Amit', 'Kumar', '38', 'Male', NULL, '2025-06-13 14:13:55.64219');
INSERT INTO public.patients VALUES (121, 'Aarav', 'Bansal', '32', 'Male', NULL, '2025-06-13 14:15:57.657015');
INSERT INTO public.patients VALUES (122, 'Divya', 'Patel', '28', 'Female', NULL, '2025-06-13 14:15:57.89474');
INSERT INTO public.patients VALUES (123, ' Rohan', 'Sharma', '45', 'Male', NULL, '2025-06-13 14:15:58.133278');
INSERT INTO public.patients VALUES (124, 'Priya', 'Verma', '30', 'Female', NULL, '2025-06-13 14:15:58.370907');
INSERT INTO public.patients VALUES (125, 'Amit', 'Kumar', '38', 'Male', NULL, '2025-06-13 14:15:58.608763');
INSERT INTO public.patients VALUES (126, 'Neil', 'Johnson', '45', 'male', NULL, '2025-06-16 09:30:07.930712');
INSERT INTO public.patients VALUES (127, 'Neil', 'Johnson', '45', 'male', NULL, '2025-06-16 09:30:13.330463');
INSERT INTO public.patients VALUES (128, 'Neil', 'Johnson', '45', 'male', NULL, '2025-06-16 09:30:14.491805');
INSERT INTO public.patients VALUES (129, 'Neil', 'Johnson', '45', 'male', NULL, '2025-06-16 09:30:15.857918');
INSERT INTO public.patients VALUES (130, 'Neil', 'Johnson', '45', 'male', NULL, '2025-06-16 09:30:16.762757');
INSERT INTO public.patients VALUES (131, '', '', '', '', NULL, '2025-06-16 09:31:53.473907');
INSERT INTO public.patients VALUES (132, 'Neil', 'Johnson', '45', 'male', NULL, '2025-06-16 10:36:25.377867');
INSERT INTO public.patients VALUES (133, '', '', '', '', NULL, '2025-06-16 11:00:23.087336');
INSERT INTO public.patients VALUES (134, 'Neil', 'Johnson', '45', 'male', NULL, '2025-06-16 13:14:09.03572');
INSERT INTO public.patients VALUES (135, 'Neil', 'Johnson', '45', 'male', NULL, '2025-06-16 13:14:11.892844');
INSERT INTO public.patients VALUES (136, '', '', '', '', NULL, '2025-06-16 15:18:19.309034');
INSERT INTO public.patients VALUES (137, 'd', 'd', 'd', 'male', NULL, '2025-06-16 16:13:46.259304');
INSERT INTO public.patients VALUES (138, '', '', '', '', NULL, '2025-06-17 02:19:20.476289');
INSERT INTO public.patients VALUES (139, 'Neil', 'Johnson', '45', 'male', NULL, '2025-06-19 12:18:51.492462');
INSERT INTO public.patients VALUES (90, 'Aarav', 'Bansal', '61', 'female', '', '2025-06-13 11:07:59.217354');
INSERT INTO public.patients VALUES (91, 'Aanya', 'Shah', '39', 'male', '', '2025-06-13 11:07:59.217354');
INSERT INTO public.patients VALUES (92, 'Ishaan', 'Bansal', '38', 'male', '', '2025-06-13 11:07:59.217354');
INSERT INTO public.patients VALUES (93, 'Vihaan', 'Patel', '65', 'female', '', '2025-06-13 11:07:59.217354');
INSERT INTO public.patients VALUES (94, 'Kiara', 'Gupta', '60', 'female', '', '2025-06-13 11:07:59.217354');
INSERT INTO public.patients VALUES (95, 'Vivaan', 'Desai', '38', 'other', '', '2025-06-13 11:07:59.217354');
INSERT INTO public.patients VALUES (96, 'Anaya', 'Mehta', '40', 'male', '', '2025-06-13 11:07:59.217354');
INSERT INTO public.patients VALUES (97, 'Aarav', 'Mehta', '18', 'male', '', '2025-06-13 11:07:59.217354');
INSERT INTO public.patients VALUES (98, 'Myra', 'Reddy', '28', 'other', '', '2025-06-13 11:07:59.217354');
INSERT INTO public.patients VALUES (99, 'Vivaan', 'Bansal', '21', 'male', '', '2025-06-13 11:07:59.217354');
INSERT INTO public.patients VALUES (100, 'Advait', 'Kapoor', '36', 'female', '', '2025-06-13 11:07:59.217354');
INSERT INTO public.patients VALUES (101, 'Myra', 'Joshi', '48', 'male', '', '2025-06-13 11:07:59.217354');
INSERT INTO public.patients VALUES (102, 'Anaya', 'Patel', '63', 'female', '', '2025-06-13 11:07:59.217354');
INSERT INTO public.patients VALUES (103, 'Aanya', 'Joshi', '40', 'female', '', '2025-06-13 11:07:59.217354');
INSERT INTO public.patients VALUES (104, 'Arjun', 'Joshi', '19', 'other', '', '2025-06-13 11:07:59.217354');
INSERT INTO public.patients VALUES (105, 'Anaya', 'Singh', '28', 'female', '', '2025-06-13 11:07:59.217354');
INSERT INTO public.patients VALUES (221437, 'asd', 'asd', '', '', NULL, '2025-06-22 14:54:26.393424');
INSERT INTO public.patients VALUES (840808, ' asd', ' asd', '', '', NULL, '2025-06-25 23:39:36.801157');
INSERT INTO public.patients VALUES (440215, 'casc', 'acsc', '', '', NULL, '2025-06-26 00:14:01.101252');
INSERT INTO public.patients VALUES (943323, 'sa', 'jjjws', '', '', NULL, '2025-06-29 02:26:35.991517');
INSERT INTO public.patients VALUES (801199, 'advait.', 'jeet', '', 'male', NULL, '2025-06-29 10:42:47.786871');
INSERT INTO public.patients VALUES (252187, 'asd', 'sad', '', '', NULL, '2025-06-29 10:52:41.89108');
INSERT INTO public.patients VALUES (111466, 'asd', 'sad', '', '', NULL, '2025-06-29 10:53:20.582738');
INSERT INTO public.patients VALUES (492279, 'asd', 'sad', '', '', NULL, '2025-06-29 11:00:07.298389');
INSERT INTO public.patients VALUES (569951, 'dsa ', 'dasd', '', '', NULL, '2025-06-29 11:00:51.553609');
INSERT INTO public.patients VALUES (834279, 'dasd', 'asd', '', '', NULL, '2025-06-29 11:03:14.022961');
INSERT INTO public.patients VALUES (195768, 'asd', 'asd', '', '', NULL, '2025-06-29 11:16:07.455882');
INSERT INTO public.patients VALUES (17484, 'asd', 'asd', '', '', NULL, '2025-06-29 11:20:00.477893');
INSERT INTO public.patients VALUES (67809, 'sad', 'asd', '', '', NULL, '2025-06-29 11:22:43.658424');
INSERT INTO public.patients VALUES (890095, 'asd', 'asd', '', '', NULL, '2025-06-29 11:29:17.267618');
INSERT INTO public.patients VALUES (534888, 'asd', 'asd', '', '', NULL, '2025-06-29 11:30:00.317296');
INSERT INTO public.patients VALUES (913275, 'asd', 'asd', '', '', NULL, '2025-06-29 11:34:34.761311');
INSERT INTO public.patients VALUES (829434, 'asd', 'asd', '', '', NULL, '2025-06-29 11:35:24.900005');
INSERT INTO public.patients VALUES (400459, 'dsf', 'fsd', '', '', NULL, '2025-06-29 11:37:26.525202');


--
-- Data for Name: pickup_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.products VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Zirconia Crown', 'Crown', 'Zirconia', 'High-strength zirconia crown for posterior teeth');
INSERT INTO public.products VALUES ('550e8400-e29b-41d4-a716-446655440001', 'E-max Crown', 'Crown', 'Lithium Disilicate', 'Esthetic lithium disilicate crown for anterior teeth');
INSERT INTO public.products VALUES ('550e8400-e29b-41d4-a716-446655440002', 'PFM Crown', 'Crown', 'Porcelain Fused to Metal', 'Traditional porcelain fused to metal crown');
INSERT INTO public.products VALUES ('550e8400-e29b-41d4-a716-446655440003', 'Zirconia Bridge 3-Unit', 'Bridge', 'Zirconia', '3-unit zirconia bridge for multiple tooth replacement');
INSERT INTO public.products VALUES ('550e8400-e29b-41d4-a716-446655440004', 'E-max Veneer', 'Veneer', 'Lithium Disilicate', 'Ultra-thin esthetic veneer for smile enhancement');
INSERT INTO public.products VALUES ('550e8400-e29b-41d4-a716-446655440005', 'Composite Veneer', 'Veneer', 'Composite Resin', 'Direct composite veneer for minor corrections');
INSERT INTO public.products VALUES ('550e8400-e29b-41d4-a716-446655440006', 'Titanium Implant Crown', 'Implant', 'Titanium/Zirconia', 'Implant-supported crown with titanium abutment');
INSERT INTO public.products VALUES ('550e8400-e29b-41d4-a716-446655440007', 'All-on-4 Prosthesis', 'Implant', 'Acrylic/Titanium', 'Full arch prosthesis supported by 4 implants');
INSERT INTO public.products VALUES ('550e8400-e29b-41d4-a716-446655440008', 'Partial Denture', 'Prosthetics', 'Acrylic/Metal', 'Removable partial denture with metal framework');
INSERT INTO public.products VALUES ('550e8400-e29b-41d4-a716-446655440009', 'Complete Denture', 'Prosthetics', 'Acrylic', 'Complete upper or lower denture');
INSERT INTO public.products VALUES ('550e8400-e29b-41d4-a716-44665544000a', 'Night Guard', 'Appliance', 'Acrylic', 'Custom night guard for bruxism protection');
INSERT INTO public.products VALUES ('550e8400-e29b-41d4-a716-44665544000b', 'Sports Guard', 'Appliance', 'EVA', 'Custom sports mouthguard for athletic protection');


--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.role VALUES ('2411f233-1e48-43ae-9af9-6d5ce0569278', 'main_doctor');
INSERT INTO public.role VALUES ('83118327-9d3d-4300-bb0c-6f09197e6e92', 'admin_doctor');
INSERT INTO public.role VALUES ('e70d04e4-5e19-41ad-b54c-e28ab322938c', 'receptionist');
INSERT INTO public.role VALUES ('cfb99d83-7799-433a-a9a7-95c67b737214', 'assistant_doctor');
INSERT INTO public.role VALUES ('a0d7822c-23c6-47a2-ab1f-4d3c4b025f84', 'Clinic Admin');


--
-- Data for Name: scan_bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: team_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.team_members VALUES ('93fa228a-bb22-4713-ac7c-9dc8abb75b8a', 'DR Just ', '', '8547585859', 'https://media.istockphoto.com/id/177373093/photo/indian-male-doctor.jpg?s=612x612&w=0&k=20&c=5FkfKdCYERkAg65cQtdqeO_D0JMv6vrEdPw3mX1Lkfg=', '83118327-9d3d-4300-bb0c-6f09197e6e92', '["billing", "all_patients", "pickup_requests", "tracking", "scan_booking", "chat"]', 'active', '123123', '2025-06-24 05:17:35.691', '2025-06-24 05:17:35.691', '2025-06-24 05:17:35.691', '2025-06-24 05:20:29.121', 'Smile Dental Clinic');
INSERT INTO public.team_members VALUES ('19c43bfd-f376-4108-9f31-75deb283d611', 'Chelsea Walters', 'gujawe@mailinator.com', '4564564564', 'Odio rerum animi ex', '83118327-9d3d-4300-bb0c-6f09197e6e92', '["chat"]', 'active', 'Pa$$w0rd!', '2025-06-27 05:46:53.997', '2025-06-27 05:46:53.997', '2025-06-27 05:46:53.997', '2025-06-27 05:46:53.997', 'Kirsten Porter');
INSERT INTO public.team_members VALUES ('fb4ad131-f8ef-4ac5-a2c5-76b85f6ab29a', 'asdfasd', '', '1230980980', 'https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D', 'cfb99d83-7799-433a-a9a7-95c67b737214', '["chat", "tracking", "scan_booking"]', 'active', '123123', '2025-06-28 04:50:04.993', '2025-06-28 04:50:04.993', '2025-06-28 04:50:04.993', '2025-06-28 04:50:04.993', 'Kirsten Porter');
INSERT INTO public.team_members VALUES ('e99be099-bf5e-4452-bcdd-3fa39535d5fd', 'camera', '', '8569666666', 'https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg', '83118327-9d3d-4300-bb0c-6f09197e6e92', '["billing", "chat", "tracking", "scan_booking"]', 'active', '123123', '2025-06-28 04:50:36.625', '2025-06-28 04:50:36.625', '2025-06-28 04:50:36.625', '2025-06-28 04:50:36.625', 'Kirsten Porter');
INSERT INTO public.team_members VALUES ('cb9b060f-3d67-4ca1-a397-cf7f3fae5399', 'orange', '', '5656523636', 'https://shorthand.com/the-craft/raster-images/assets/5kVrMqC0wp/sh-unsplash_5qt09yibrok-4096x2731.jpeg', 'e70d04e4-5e19-41ad-b54c-e28ab322938c', '["chat", "tracking", "scan_booking", "billing", "all_patients"]', 'active', '123123', '2025-06-28 05:14:21.611', '2025-06-28 05:14:21.611', '2025-06-28 05:14:21.611', '2025-06-28 05:14:21.611', 'Kirsten Porter');
INSERT INTO public.team_members VALUES ('1b961d39-af9e-4910-bdbd-809debc817d5', 'receptionist', '', '2222222222', '', 'e70d04e4-5e19-41ad-b54c-e28ab322938c', '["pickup_requests", "billing", "all_patients", "tracking", "scan_booking", "chat"]', 'active', '123123', '2025-06-25 09:35:38.814', '2025-06-25 09:35:38.814', '2025-06-25 09:35:38.814', '2025-06-25 12:53:54.973', 'Tatum Bush');
INSERT INTO public.team_members VALUES ('2ddb6b06-6dc8-4c1c-bc40-3f05e29d374d', 'DR DOCTOR', '', '1111111111', 'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?cs=srgb&dl=pexels-souvenirpixels-414612.jpg&fm=jpg', 'cfb99d83-7799-433a-a9a7-95c67b737214', '["billing", "all_patients", "pickup_requests", "tracking", "chat", "scan_booking"]', 'active', '123123', '2025-06-25 09:33:37.237', '2025-06-25 09:33:37.237', '2025-06-25 09:33:37.237', '2025-06-25 12:58:56.12', 'Tatum Bush');
INSERT INTO public.team_members VALUES ('2e0fcd84-fc67-4be9-8be3-ba102f0f242a', 'ASd', '', '1233211233', '', 'cfb99d83-7799-433a-a9a7-95c67b737214', '["billing", "all_patients", "chat", "tracking"]', 'active', '123123', '2025-07-06 11:53:21.498', '2025-07-06 11:53:21.498', '2025-07-06 11:53:21.498', '2025-07-06 11:53:21.498', 'Pamela Sherman');
INSERT INTO public.team_members VALUES ('be677dae-99f3-4e19-8731-a461d6bccb72', 'dr Jens', '', '5896589658', 'wew', '83118327-9d3d-4300-bb0c-6f09197e6e92', '["chat", "scan_booking", "tracking"]', 'active', '1231', '2025-06-26 17:13:09.43', '2025-06-26 17:13:09.43', '2025-06-26 17:13:09.43', '2025-06-26 17:13:09.43', 'Kirsten Porter');
INSERT INTO public.team_members VALUES ('ab973f87-7f4c-4efa-af4b-5e1a3aea7102', 'NUk123 Sadan', 'san@gmail.com', '1111111111', '', '83118327-9d3d-4300-bb0c-6f09197e6e92', '["chat", "tracking", "scan_booking"]', 'active', '123123', '2025-07-04 07:52:29.019', '2025-07-04 07:52:29.019', '2025-07-04 07:52:29.019', '2025-07-07 21:43:53.931', 'Pamela Sherman');
INSERT INTO public.team_members VALUES ('54073a75-4fa6-4b24-be3c-856f64912ba7', 'Jana Cameron', 'huboro@mailinator.com', '5656969989', '', '83118327-9d3d-4300-bb0c-6f09197e6e92', '["all_patients", "billing", "chat", "tracking"]', 'active', 'Pa$$w0rd!', '2025-07-12 09:25:05.904', '2025-07-12 09:25:05.904', '2025-07-12 09:25:05.904', '2025-07-12 09:25:05.904', 'Pamela Sherman');
INSERT INTO public.team_members VALUES ('3dc086cd-f4f0-479b-8b90-bcfeea4fe074', 'Cyrus Russell', 'qokecoce@mailinator.com', '8985898585', '', 'cfb99d83-7799-433a-a9a7-95c67b737214', '["chat", "tracking", "scan_booking"]', 'active', 'Pa$$w0rd!', '2025-07-12 09:44:09.047', '2025-07-12 09:44:09.047', '2025-07-12 09:44:09.047', '2025-07-12 09:44:09.047', 'Pamela Sherman');
INSERT INTO public.team_members VALUES ('8ce22990-0760-4cf6-a2cb-9606fbb92f49', 'Winter Cardenas', 'rusu@mailinator.com', '2363333333', '', 'e70d04e4-5e19-41ad-b54c-e28ab322938c', '["chat", "scan_booking", "tracking"]', 'active', 'Pa$$w0rd!', '2025-07-12 09:47:03.766', '2025-07-12 09:47:03.766', '2025-07-12 09:47:03.766', '2025-07-12 09:47:03.766', 'Pamela Sherman');


--
-- Data for Name: tooth_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tooth_groups VALUES ('13cd1cf2-2415-4fac-a892-1e8021cbdc3d', 'a1111111-1111-1111-1111-111111111111', 'group-79-0', '[30, 45]', 'bridge', 'bridge restoration for teeth 30, 45', 'Standard', 'A1', NULL);
INSERT INTO public.tooth_groups VALUES ('3ba40cf6-52d1-4810-b552-7e94382b5d8d', 'a1111111-1111-1111-1111-111111111111', 'group-79-1', '[11]', 'crown', 'crown for tooth 11', 'Zirconia', 'B2', NULL);
INSERT INTO public.tooth_groups VALUES ('79e622fc-717f-4f73-90f4-cf53ccae59ed', 'b2222222-2222-2222-2222-222222222222', 'group-80-0', '[22, 23]', 'veneer', 'veneer placement for teeth 22 and 23', 'Porcelain', 'A2', 'Handle with care');
INSERT INTO public.tooth_groups VALUES ('e4301d94-ec3e-435e-87de-654896fe955a', 'b2222222-2222-2222-2222-222222222222', 'group-80-1', '[14]', 'implant', 'implant for tooth 14', 'Titanium', 'C1', NULL);
INSERT INTO public.tooth_groups VALUES ('b3f76939-a8b6-46b0-bc5c-101ff17ac80d', '2202bd94-ce4b-420a-b365-84772f0b76bb', 'group-1751179364922', '[13, 14]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('14908176-2c85-4bce-bc87-d660c81a4672', '2422c07f-9aa3-453d-a305-573f6cff1594', 'group-1751179986746', '[11, 12]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('f2de2042-4a2e-4a96-bbbb-336f216959f3', 'd57ea4b3-2cdd-4a78-8aac-049b299dc1ab', 'group-1751180812425', '[11, 21]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('cdae7f06-5ea4-44b7-b94b-d9924c092631', '944d8a62-5429-41d5-a296-3c54ecd83943', 'group-1751182060168', '[14, 15, 16]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('a68abd43-e98b-4a60-93e1-a26929d3c352', '8fb59568-8cad-494e-af43-cc7041bdef8f', 'group-1751182239344', '[12, 13, 14, 15, 16, 17, 18]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('0f2d5785-962c-4cd2-afdf-38b7fd582674', '8fb59568-8cad-494e-af43-cc7041bdef8f', 'group-1751182246896', '[25, 26, 27]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('83a1d408-c727-455e-8f73-c4521154f21b', '577ddf16-8397-4b11-980c-7d800b8b3b8f', 'group-1751188227889', '[13, 14]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('e7bc70bd-ad8b-4840-a700-42a716bcdbf6', '7303bef2-4e33-4764-9c55-1bfb1c2a01c5', 'group-1751188227889', '[13, 14]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('a35eab96-0ed1-4df0-a57f-ed9e2f1914f3', 'a604cd3d-5205-491e-9d3e-7ad67ec773a9', 'group-1751188227889', '[13, 14]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('1e7d27ee-e001-46c2-8922-7eec15f3206d', 'd40ffa81-e318-43c8-8e65-b101ad103b7d', 'group-1751188227889', '[13, 14]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('7f48a65e-e8f5-4545-9426-64a38b126481', 'df57d6aa-856f-4f2a-94d5-f1b17b86a636', 'group-1751188227889', '[13, 14]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('26efd6cb-d802-4c71-90f4-9e58f95bf507', '0c28ccf9-c345-432e-8ee1-30b54b939bbd', 'group-1751188227889', '[13, 14]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('b2af5de3-6807-4bae-a53f-f55f6d5ab057', '3ad80d5d-d036-4058-9867-3b401b020437', 'group-1751188227889', '[13, 14]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('88566124-1317-490e-adbb-036d678e0aad', '1738054b-9726-4f60-8c52-39d2f5b68fb3', 'group-1751188227889', '[13, 14]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('237f8042-00c1-45b9-8197-fa6a56c25383', 'f26f620c-db71-4514-9f26-64e983949dab', 'group-1751188765449', '[11, 12, 21]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('74c96862-5412-4747-bab4-dec9613aac8b', 'f26f620c-db71-4514-9f26-64e983949dab', 'group-1751188773937', '[25, 26, 27]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('96fb0a56-852e-40a9-84eb-34c72078838d', '8276f80a-9377-47e1-8769-95fe0a8e2970', 'group-1751189487553', '[14, 15, 16]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('e7483a84-5316-4427-bc8d-354cc0f78848', '8276f80a-9377-47e1-8769-95fe0a8e2970', 'group-1751189495272', '[25, 26, 27, 28]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('6a9a4f1f-1c77-45e5-a56e-231ccf1601a5', 'c7ad84b9-81bf-4517-aa7a-98286a765407', 'group-1751189487553', '[14, 15, 16]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('0a3ec2b1-339f-4698-85df-60da97d95cfc', 'c7ad84b9-81bf-4517-aa7a-98286a765407', 'group-1751189495272', '[25, 26, 27, 28]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('998532bd-657f-44a1-a9d7-fb2f91e2ec93', '310bc29c-b0e5-4dd2-9da7-9376c93172f9', 'group-1751189958736', '[15, 16, 17]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('ba6387f9-0192-4b92-bcc9-d3455d7106ce', '310bc29c-b0e5-4dd2-9da7-9376c93172f9', 'group-1751189967904', '[33, 34, 35, 36]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('fff7cdd7-31f5-4e1f-b03c-bc43e1f0f0bc', '58953ca3-efd8-4bda-b4d6-e3d012e7e7c7', 'group-1751190308176', '[15, 16, 17, 18]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('d5d7682b-9abf-4c21-8c50-9f464be1826c', '58953ca3-efd8-4bda-b4d6-e3d012e7e7c7', 'group-1751190315432', '[33, 34, 35, 36]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('0cf22fb5-8fef-4b25-bb12-f6954af01530', '04bfe1db-730d-473e-a3b1-7403335ae1c9', 'group-1751190485327', '[11, 12, 13, 14, 15, 16]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('69954318-1a68-4b61-b037-4d8565375e8c', 'db15ef5d-3634-4611-b823-45398a96c486', 'group-1751191893455', '[14, 15, 16, 17, 18]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('0c9eabe9-efe3-4e11-97a5-78c537b19c30', 'db15ef5d-3634-4611-b823-45398a96c486', 'group-1751191899903', '[24, 25, 26]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('be592eab-60d9-4caf-809a-5e1976c391ff', '96e04a37-1a81-4520-9c65-1e2dcf5e75de', 'group-1751196183398', '[13, 14, 15]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('4564d056-5dc4-4212-8f30-4de13aa6589e', 'bbe04d18-cde5-4932-84b4-f66fa2fdb105', 'group-1751196994119', '[14, 15, 16]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('40f22459-7451-4ef5-baea-4f88d7ad18d5', '352d0043-e8b6-419f-a937-b3b0d1115aee', 'group-1751261446530', '[12, 13, 14, 15, 16, 17, 18]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('3314b63e-1d48-42b8-878c-6b97d325838a', 'eb6ae715-e60e-42ba-a5dd-8875e8e5b3ab', 'group-1751261446530', '[12, 14, 15, 16, 17, 18]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('347c2f0e-dac6-4d2d-9d61-46c928b36502', 'a5569c5d-e181-41e7-acb6-722851bc6ffb', 'group-1751261446530', '[12, 14, 15, 16, 17, 18]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('04d918d7-d9f4-4e4b-bc5f-84cc414b280e', '0eea8d5a-d9fa-4483-9cb5-01368625f36e', 'group-1751261446530', '[12, 14, 15, 16, 17, 18]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('dff2de0b-8577-45e2-8643-61031e3533d7', '2d8811a0-c826-40fc-be2d-1020dc9d26f2', 'group-1751261446530', '[12, 14, 15, 16, 17, 18]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('89412750-c0b3-44ce-8d87-1ecec252330d', '0881a041-b86c-4119-ab38-7d7d1c63bc99', 'group-1751261446530', '[12, 14, 15, 16, 17, 18]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('532e9e17-08dd-458c-a4b7-c1e3b184c4fc', 'ed79db24-4b07-4f16-a36b-8d784fe9f12d', 'group-1751261446530', '[12, 14, 15, 16, 17, 18]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('b5210167-ff86-4c74-a35b-dac9e3207547', '6daa3ca9-62f3-44c8-a161-99a48958ae70', 'group-1751276571064', '[12, 13]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('2457f8d6-772d-42e9-8d00-3c3114fef2c0', 'ac13771c-9d72-4e7a-92bd-aa24dc11ea94', 'group-1751279055110', '[11, 21]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('d76461ce-445e-4a25-9061-db8434146265', '23e7b70e-bd46-4d31-b7ae-b3380a0299d1', 'group-1751280333637', '[11, 12]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('36addb66-b978-40a8-8f63-3723a8bb9ecc', '59778136-4499-4f38-808e-93bdf311bc78', 'group-1751281170652', '[11, 21, 22]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('79022974-f76b-416e-ab9a-5b618f882e7c', '59778136-4499-4f38-808e-93bdf311bc78', 'group-1751281174652', '[26, 27, 28]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('379f5a0c-5bed-4e6a-90a6-aa71114c79ee', '472e80dd-2309-484e-982e-98a9c2f4ad63', 'group-1751281397844', '[13, 14]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('a80a767d-a17a-43d0-bcfe-972d29beee1b', 'c9090b3d-f6dc-40bc-b8c8-b3412184ccd8', 'group-1751286526713', '[12, 13, 14]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('f07b237c-d060-4e2d-9efa-63d59f9c4789', 'c9090b3d-f6dc-40bc-b8c8-b3412184ccd8', 'group-1751286527968', '[11]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('60a4af07-3755-48fc-9602-02fa0f102767', 'c9090b3d-f6dc-40bc-b8c8-b3412184ccd8', 'group-1751286529288', '[21, 22]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('93efa7d9-b844-4439-8382-87b3f24941f0', 'c9090b3d-f6dc-40bc-b8c8-b3412184ccd8', 'group-1751286536432', '[23]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('e84ac4ce-fa36-49fd-b6cd-65546652b3f0', 'c9090b3d-f6dc-40bc-b8c8-b3412184ccd8', 'group-1751286542280', '[25, 26]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('ecb67b48-df37-4c83-9175-56c1b5cc2af9', '950ad384-eee3-4f29-946a-ae361a3c66f0', 'group-1751290115534', '[11, 12, 21]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('db2be399-00ec-417e-bf98-5958ecc246e2', '950ad384-eee3-4f29-946a-ae361a3c66f0', 'individual-1751290182006', '[14, 13, 28]', 'individual', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('2c4efdd7-1632-464d-8847-266b24e718c8', '2a248504-8be4-485b-accd-522c459a5837', 'group-1751303510575', '[11, 12, 21]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('a4e57b22-4b0c-45eb-bc2f-d307c7fae4f5', '2a248504-8be4-485b-accd-522c459a5837', 'group-1751303517295', '[35, 36, 37, 38]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('ac4c3105-97ac-486a-80c0-58272ecdafad', 'b37ff754-66a1-4dca-84bd-e655f238d866', 'group-1751303969343', '[11, 12, 21]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('94c6a65c-d3dc-4eea-9f15-db45f1f99872', '25b082fe-41e2-4459-98fb-fb3442fd63b1', 'group-1751304324073', '[11, 21]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('ee360270-3cf0-4cf5-9354-ec121b43000d', '25b082fe-41e2-4459-98fb-fb3442fd63b1', 'group-1751304327647', '[27, 28]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('187963e4-d32a-4892-a300-e255a798c182', 'f6c86b46-4a59-4ca6-bc6c-94019b0301b4', 'group-1751304737790', '[23, 24, 25]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('e3f488c9-56f4-4987-9ddc-51fc0d230524', 'f039f868-84c5-4bce-a7d9-f7e9b7dcb696', 'group-1751305663389', '[11, 12]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('e7f5bbb3-ffeb-41a6-be98-c1c4dc758101', 'eb9c798b-98fc-4141-90dd-cbebe0ba6ab9', 'group-1751306721550', '[26, 27]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('5e38a1f3-7b0a-4244-93f6-10e2c571ea3f', 'a32f8913-40f7-4571-b534-89103aba7043', 'group-1751306886612', '[11, 12, 13]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('76e80b9c-f815-40e9-839a-2d4ee8f0dcea', 'ce476f47-fa68-40da-84d3-4d157aca3917', 'group-1751306886612', '[11, 12, 13]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('4dee7187-290a-4fdd-911e-1129f1afb8f0', 'e27d4d24-04d2-4675-a683-365854ca8564', 'group-1751307382861', '[21, 22]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('4c9bc6a8-35d4-4737-b6b6-087d626b9574', 'd7bdb276-85c8-4fe9-985b-e82502745b97', 'group-1751309288563', '[13, 14]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('b6890690-fb1b-4986-9871-d1ad3360aa7f', 'cc996ad1-f86a-4ece-a9fd-84af65f88d65', 'group-1751310332115', '[13, 14]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('cb030eb8-be74-467d-aa48-1128bf137a74', 'cdaa670a-30e8-47a5-b77e-a03cbb5927d7', 'group-1751312214417', '[11, 12, 21]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('59fa1976-3cff-4109-aad2-ebf5f2896827', '12524bb4-889d-452f-aa8e-a63fd93a34fb', 'group-1751312517305', '[11, 21]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('79cfb5c8-5f97-48a9-b1d2-b446e4ba830e', '21dbd6b9-9015-4719-b315-31574bc58f00', 'group-1751348523469', '[11, 21]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('461b64b1-5665-49fb-9c46-9f34a6603ffa', '6b8c5f45-9b74-494e-8cfa-15323db7bd61', 'group-1751349015414', '[24, 25]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('1b16e604-8673-4e7b-b30a-bc633b9ff636', '6b8c5f45-9b74-494e-8cfa-15323db7bd61', 'group-1751349023191', '[41, 42, 43]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('91037ceb-621c-47f6-ab51-eb91cfb2e168', '94ae2273-7d1c-40ad-af5d-71f6fc03cdb4', 'group-1751349126166', '[11, 21]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('f5a6e074-d411-4fe6-865a-4f09016f3055', '94ae2273-7d1c-40ad-af5d-71f6fc03cdb4', 'group-1751349134072', '[26, 27, 28]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('075a6949-87c3-4bbc-aa9f-b37cd06b5cd5', '15ca77c2-e8ff-4b75-a247-019a934710ba', 'group-1751352289018', '[24, 25]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('96ca435e-4558-4386-9969-9172a6e6ec82', '15ca77c2-e8ff-4b75-a247-019a934710ba', 'group-1751352295441', '[11, 21, 22]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('7e251f3d-4831-4738-9a0f-8236436915fa', 'd7cb715b-51d5-40de-8e59-448aa4755d7f', 'group-1751352410434', '[11, 21]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('36dde034-a722-452f-b1fe-05f3982c9fb8', 'd7cb715b-51d5-40de-8e59-448aa4755d7f', 'group-1751352414450', '[25, 26, 27]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('69daa0a5-953a-40d6-8ed5-840282bba195', '262e074c-8b21-4be8-a815-159048b5c988', 'group-1751352714259', '[11, 21]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('14fe3968-abb2-43ec-be18-11d3eb080e1c', '262e074c-8b21-4be8-a815-159048b5c988', 'group-1751352725730', '[31, 32, 33]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('fd1a6a56-54e6-4cc7-8bcd-faa4a2e63a29', '72eb6c65-00f6-4c46-b1fc-cb423e9fd806', 'group-1751352714259', '[11, 21]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('34afc5f1-794d-4e1f-a892-8a06518cb782', '72eb6c65-00f6-4c46-b1fc-cb423e9fd806', 'group-1751352725730', '[31, 32, 33]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('ca6b4277-4dc7-48f3-878d-bf299b513518', 'ce1c0022-49ef-4101-ae4f-b62346c09d2f', 'group-1751352714259', '[11, 21]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('fa9f839e-61cf-4c8b-b983-cca811c94d0e', 'ce1c0022-49ef-4101-ae4f-b62346c09d2f', 'group-1751352725730', '[31, 32, 33]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('920c220a-fd9a-4517-8ae2-64b511cca4df', '310174df-1195-4670-ba67-3c1e91d12776', 'group-1751352410434', '[11, 21]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('600febf3-18ab-40a4-b599-e34340c014f6', '310174df-1195-4670-ba67-3c1e91d12776', 'group-1751352414450', '[25, 26, 27]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('f7927f68-0a9a-4f49-9373-6abc0292a587', '574cb94d-16aa-43f7-91ef-ad633a184c9d', 'group-1751361834836', '[11, 21, 22]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('e1329302-b9af-440c-ad39-bcb37d42c164', '574cb94d-16aa-43f7-91ef-ad633a184c9d', 'group-1751361838804', '[34, 35, 36]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('1f40d439-bbe9-4cd2-bb5c-c90ac02650e4', 'd80e0473-404c-4578-957b-999f97fedb99', 'group-1751361834836', '[11, 21, 22]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('8bf7c025-ee1b-4d1f-8bf7-5c53a3f28375', 'd80e0473-404c-4578-957b-999f97fedb99', 'group-1751361838804', '[34, 35, 36]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('4393f887-5e68-4afb-98b6-5f516aa4a2dd', '464d02e2-3c70-40ea-b5df-a7f677fab236', 'group-1751363131862', '[11, 12, 21]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('4e3bc07f-1b09-4cf2-8691-0b693d2014c4', '464d02e2-3c70-40ea-b5df-a7f677fab236', 'group-1751363137261', '[25, 26, 27]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('244873ce-69b1-4a45-a38c-9fd1347886f0', 'b456587f-91c6-426c-bffa-6af30e81c4f3', 'group-1751363337502', '[21, 22, 23]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('3afb6377-db19-4947-b5d9-6e1d9124bb24', 'b456587f-91c6-426c-bffa-6af30e81c4f3', 'group-1751363342141', '[26, 27, 28]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('55381792-689c-48a0-9de5-2299afedf781', 'b7a35f16-0c9c-4b3e-98d1-904006a70ef9', 'group-1751363649382', '[11, 12, 13]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('e56e3715-502b-4d07-8e97-651d48473340', 'b7a35f16-0c9c-4b3e-98d1-904006a70ef9', 'group-1751363653286', '[23, 24, 25]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('92b1f3ae-27af-432b-b4f7-91f99ac34e6a', '37b55ccb-1420-4957-a901-d3696cf2318b', 'group-1751364192791', '[16, 17]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('8ae67e3a-509b-445d-9a98-993342e2e0ea', '9bacdb56-f09a-4769-a2cb-1b6105320eb5', 'group-1751364546959', '[14, 15]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('d330844c-5e86-4672-b9ed-da7af782c3ee', '9bacdb56-f09a-4769-a2cb-1b6105320eb5', 'group-1751364555991', '[31, 41]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('d9a5e600-3294-4cd6-91e7-e895cf36c3c6', 'de520d5c-b8b6-48e8-bdcf-74aacd6dabf2', 'group-1751369535260', '[21, 22]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('93f78fc3-df1d-40d7-aec4-86de209bdbd8', '9d21ea2c-d92a-448b-a0de-35efc9ef83b9', 'group-1751373545560', '[11, 21]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('5186145b-9a51-4f59-9aa3-0e1e27049836', '0941b929-2ee7-42c3-9e9c-742aefec33c2', 'group-1751373998009', '[11, 21]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('6f8e3102-f1b4-4b64-b37f-ac8e56e5ca53', 'cf0ba829-d01b-4b52-9f4b-eaa50ac748ca', 'group-1751385446339', '[14, 15, 16]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('2d5656c4-bd93-42ae-a477-b3e63bcb0dc8', 'cf0ba829-d01b-4b52-9f4b-eaa50ac748ca', 'group-1751385450210', '[25, 26]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('764adca2-4d7a-4fde-abce-db0feb477cb5', '7bead81f-e2f8-45be-8189-6be73762cff8', 'group-1751385847402', '[15, 16]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('c82cfb06-7fad-4a40-8ed1-97bc2ff010ba', '7bead81f-e2f8-45be-8189-6be73762cff8', 'group-1751385857114', '[31, 32, 33]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('ae099991-b4c2-43aa-9e13-6f35922d92fc', 'ee2992d5-f428-4e5b-8224-0e5b60f728ce', 'group-1751433477280', '[16, 17, 18]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('896dc144-2124-490a-8edb-8aae688cd4ef', 'a2f3e428-d649-416c-a6dd-fa5f73b34a58', 'group-1751438263629', '[21, 22]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('a0056e55-ba98-4ff6-aa11-ab31f3a2fc59', 'a2f3e428-d649-416c-a6dd-fa5f73b34a58', 'group-1751438268390', '[16, 17, 18]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('8476ff03-be58-43fb-9a6b-12fad7c1bf3c', 'b4b4cc2f-60bf-4a7a-8589-c26f0f8b0bbe', 'group-1751438901987', '[14, 15, 16, 17, 18]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('c86287e9-de94-4ae3-85db-1b46e235008f', '7754ac13-ba1e-407e-96ba-684ecdc006e8', 'group-1751438827652', '[11, 21]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('0a51a42c-09e9-453d-b250-e9a0b2cc094a', '7754ac13-ba1e-407e-96ba-684ecdc006e8', 'group-1751438832956', '[26, 27, 28]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('9eda3c8e-aea1-467b-93a8-51d5e3044b1c', '012caa0e-d3b1-4de9-bf0c-356a3c8107c4', 'group-1751439319381', '[13, 14]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('e436b2bc-fe02-4dbc-a596-bc8593ebb309', '012caa0e-d3b1-4de9-bf0c-356a3c8107c4', 'group-1751439324020', '[26, 27, 28]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('24fdfe75-1ad0-4d7a-b83a-7d3d18b842b9', '66ad6ce9-7302-4b62-86cf-3854abb03936', 'group-1751439497132', '[11, 21]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('6b540757-385c-4893-8e50-f82a0cb58609', '66ad6ce9-7302-4b62-86cf-3854abb03936', 'group-1751439501524', '[31, 41]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('6c3aa88e-8502-4f1b-a41d-a29d6804e22d', '22c93328-72a1-4fc9-aee1-cf609a585ef5', 'group-1751440192243', '[11, 21]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('1203f035-f29a-465e-99ca-7f3ed690199e', '22c93328-72a1-4fc9-aee1-cf609a585ef5', 'group-1751440195596', '[14, 15, 16]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('d2d8c43a-7f0f-44bf-9b81-c449f71647fb', '8416e1a9-a7b0-4348-a4e4-7c26477fa8fc', 'group-1751440192243', '[11, 21]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('00397b43-f29b-4127-a3e0-6c57996ceb21', '8416e1a9-a7b0-4348-a4e4-7c26477fa8fc', 'group-1751440195596', '[14, 15, 16]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('c7b21612-19d9-4657-bf21-ade31b74d574', 'b74d4485-5f94-4e80-95b2-f70350513e88', 'group-1751441088443', '[11, 21]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('298627f8-f908-415c-b328-4bc5eda8bc28', '0247d00f-0c4b-43df-8a35-ba55566c4c73', 'group-1751454183668', '[11, 12]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('65323484-7cab-4b12-b3c8-40e82b81d703', '2870e560-a02e-45fd-abad-dba9a7170ac9', 'group-1751458590639', '[26, 27]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('ad0bab46-ec9b-49ba-b781-b17239d6cf0b', 'a7d62239-8389-461e-9c55-9f1d2d3ea6b9', 'group-1751476612737', '[11, 12, 13, 21]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('3c6927ea-acb8-4995-b7a0-84a2ba7cc7ee', 'a7d62239-8389-461e-9c55-9f1d2d3ea6b9', 'group-1751476616024', '[26, 27, 28]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('83779873-0e17-4730-9d3a-60f3e1a5447a', '9bdad427-86ec-4936-ba70-8601479f8aa4', 'group-1751549056913', '[25, 26]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('bb83220a-a8fb-4573-aac8-389a77f8fcf2', '9bdad427-86ec-4936-ba70-8601479f8aa4', 'group-1751549060464', '[16, 17, 18]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('e534f8de-6100-426c-ba84-17824d3578ef', '1f79b142-0ff4-4941-8b86-d934b214af78', 'group-1751562871671', '[11, 21, 22, 23]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('f4dc2a08-6510-4f95-ac1b-b702eb10f287', '1f79b142-0ff4-4941-8b86-d934b214af78', 'group-1751562875899', '[16, 17, 18]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('da3fee06-441b-495c-9602-a64a51772442', '200fd625-3656-4caf-826b-a62ced6277f0', 'group-1751568662671', '[25, 26, 27]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('65cc4c3f-dc5a-4da3-9cfa-eef275fae371', '200fd625-3656-4caf-826b-a62ced6277f0', 'group-1751568697831', '[45, 46, 47, 48]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('f84adbb8-cf93-4d32-839e-c6603dc42c34', '200fd625-3656-4caf-826b-a62ced6277f0', 'group-1751568733438', '[11, 12, 21]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('afda1bb0-cc6c-470a-ae4d-32a77c548a39', 'bb3a7914-aa55-4640-addd-da89c82d391f', 'group-1751569258470', '[11, 21, 22]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('a1c11be4-9458-4622-8611-cc39928c105f', 'bb3a7914-aa55-4640-addd-da89c82d391f', 'group-1751569262847', '[26, 27, 28]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('24709e53-bf18-4342-863c-ef4f846ecff2', 'be84f6f0-2966-41c2-ba95-23805cea4a7a', 'group-1751620202068', '[21, 22, 23]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('da684e07-4eb5-424c-993b-859d346f1a72', 'be84f6f0-2966-41c2-ba95-23805cea4a7a', 'group-1751620206986', '[26, 27, 28]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('99de10ab-eaa2-4af0-9338-7c004779ab52', '5770d8ec-fd73-4d55-a4af-55785439591c', 'group-1751620718218', '[11, 12, 13, 21]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('d0fbe69f-43af-4f30-b11b-75d0ba6b8ba4', '5770d8ec-fd73-4d55-a4af-55785439591c', 'group-1751620721946', '[26, 27, 28]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('8c5560c2-00da-45fc-b1fe-1ba5a5a08796', '5770d8ec-fd73-4d55-a4af-55785439591c', 'group-1751620758170', '[15, 16, 17, 18]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('b8b2aa16-6f15-493d-b3ad-878a52bf1508', 'c6d3791b-abc5-4205-9ea9-fbd6a53cbb9a', 'group-1751631375487', '[27, 28]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('55e90e60-3fd8-4973-9648-41e2e1b36d4e', 'b921fe7d-e910-438d-a6d7-b80c06531706', 'group-1751637602481', '[11, 12, 21]', 'bridge', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('9d051cd3-d5de-4acd-a80e-f44a31da353d', '0ab12eac-cfde-4d03-b381-39d4ae5a307c', 'group-1751647382920', '[14, 15]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('49288c77-a05b-4047-94d0-3095a7a61d7b', '34d93758-bfc3-4e9d-832f-15bdba7c8e00', 'group-1751651602942', '[11, 12, 21]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('9c76565e-0350-44c5-afcb-8b877c6d6b4e', 'ecd82cfe-36bf-4f45-ab87-cb3b6c3a02e2', 'group-1751653177023', '[11, 21]', 'joint', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('017f4853-b36c-44d5-9f6d-8ccacd922181', '7e282884-5062-48ab-87bb-c07fed12ad1b', 'group_1752323847498_06ksw14qf', '[]', '', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('238a83f2-b11b-4433-a7b8-f32e40d7cedf', 'cbdf63f3-301e-45eb-87db-77b24ef1834f', 'group_1752324776928_e4ejodki6', '[]', '', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('f58efe7d-24bd-493b-b2a5-4d1575928541', 'cbdf63f3-301e-45eb-87db-77b24ef1834f', 'group_1752324777073_fqrf33w0c', '[]', '', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('a6946a2d-b1ca-4886-a350-e8e255da6382', '93456f18-2223-4d35-af0e-603cbde67b22', 'group_1752351259935_jalxwklt9', '[]', '', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('32cbbd2f-3a86-4aa1-8547-de43d0878a7a', '93456f18-2223-4d35-af0e-603cbde67b22', 'group_1752351260005_42wxzj3nl', '[]', '', '', '', '', NULL);
INSERT INTO public.tooth_groups VALUES ('f00d9873-a388-43c9-a552-e3857e71d7e4', '2a369632-8bd4-4d85-bd3b-7a89ce900876', 'group_1752354266721_hib7k99iv', '[22, 21, 11]', 'joint', '', '', 'A1 - Vita Classic', NULL);
INSERT INTO public.tooth_groups VALUES ('7c36d172-d451-4bfc-8a80-c3b106bb56a0', '6e72efc6-93af-4b91-bfac-fb2b78c61f72', 'group_1752354616068_n3qeziqb7', '[24, 23, 22]', 'joint', '', '', 'A3.5 - Vita Classic', NULL);
INSERT INTO public.tooth_groups VALUES ('ba0b99bc-3672-4509-8f3b-723864168e3c', 'e73522d5-1d83-4b2c-ae5b-7e117ad9a101', 'group_1752354761198_wq21t3yeh', '[23, 22, 21]', 'joint', '', '', 'A2 - Vita Classic', NULL);
INSERT INTO public.tooth_groups VALUES ('6c2721fd-973b-4864-a078-eeb3636517e4', 'b2d39426-7a9f-4bf4-977f-2dcb172cd171', 'group_1752356790037_9wbmco0l8', '[22, 21, 11]', 'joint', 'asdasdsad', '', 'A1 - Vita Classic', NULL);
INSERT INTO public.tooth_groups VALUES ('c5300252-9f93-412a-bd83-4da8fc0c081b', '707f3378-a26f-490b-9076-f79967912f28', 'group_1752357443620_fvfs41l72', '[21, 11]', 'joint', 'this is a shade', '', 'A3.5 - Vita Classic', NULL);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES (881093, '5555555555', '123123');
INSERT INTO public.users VALUES (806884, '4444444444', '123123');
INSERT INTO public.users VALUES (496784, '1111111111', '123123');
INSERT INTO public.users VALUES (586061, '4444444444', '123123');
INSERT INTO public.users VALUES (422134, '1111111111', '123123');
INSERT INTO public.users VALUES (440104, '4444444444', '123123');
INSERT INTO public.users VALUES (978738, '1111111111', '123123');
INSERT INTO public.users VALUES (156539, '1111111111', '123123');
INSERT INTO public.users VALUES (578442, '2222222222', '123123');
INSERT INTO public.users VALUES (909861, '8000212121', '123123');
INSERT INTO public.users VALUES (665230, '8000222222', '123123');
INSERT INTO public.users VALUES (596812, '', 'password');
INSERT INTO public.users VALUES (571690, '5896589658', '565656');
INSERT INTO public.users VALUES (687970, '9696969696', '123123');
INSERT INTO public.users VALUES (967999, '5896589658', '1231');
INSERT INTO public.users VALUES (586433, '5656563636', '123123');
INSERT INTO public.users VALUES (715973, '2131231231', '1231');
INSERT INTO public.users VALUES (357097, '5858585858', '123123');
INSERT INTO public.users VALUES (773733, '1231233211', '123');
INSERT INTO public.users VALUES (275404, '4781231231', 'Pa$$w0rd!');
INSERT INTO public.users VALUES (440558, '5671231231', 'Pa$$w0rd!');
INSERT INTO public.users VALUES (200014, '4564564564', 'Pa$$w0rd!');
INSERT INTO public.users VALUES (368377, '1230980980', '123123');
INSERT INTO public.users VALUES (253346, '8569666666', '123123');
INSERT INTO public.users VALUES (314308, '5656523636', '123123');
INSERT INTO public.users VALUES (634667, '1111111111', '123123');
INSERT INTO public.users VALUES (367346, '1233211233', '123123');


--
-- Name: clinic clinic_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic
    ADD CONSTRAINT clinic_email_key UNIQUE (email);


--
-- Name: clinic clinic_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic
    ADD CONSTRAINT clinic_pkey PRIMARY KEY (id);


--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- Name: lifecycle_stages lifecycle_stages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lifecycle_stages
    ADD CONSTRAINT lifecycle_stages_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: role role_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_name_key UNIQUE (name);


--
-- Name: role role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (id);


--
-- Name: team_members team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_pkey PRIMARY KEY (id);


--
-- Name: tooth_groups tooth_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tooth_groups
    ADD CONSTRAINT tooth_groups_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

