--
-- PostgreSQL database dump
--

\restrict KKy5FyOONKKhrMyQKGO1h1g9sv4UirQmfGfZqLrkx0L62LtXRsO2CX5BiaBw3Dw

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-07-21 19:19:25

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
-- TOC entry 222 (class 1259 OID 16485)
-- Name: listings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.listings (
    id integer NOT NULL,
    user_id integer,
    title character varying(255) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    image_url character varying(255),
    status character varying(50) DEFAULT 'active'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.listings OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16484)
-- Name: listings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.listings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.listings_id_seq OWNER TO postgres;

--
-- TOC entry 5043 (class 0 OID 0)
-- Dependencies: 221
-- Name: listings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.listings_id_seq OWNED BY public.listings.id;


--
-- TOC entry 224 (class 1259 OID 16504)
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    sender_id integer,
    receiver_id integer,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16503)
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.messages_id_seq OWNER TO postgres;

--
-- TOC entry 5044 (class 0 OID 0)
-- Dependencies: 223
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- TOC entry 226 (class 1259 OID 16526)
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    reviewer_id integer,
    reviewee_id integer,
    rating integer,
    review_text text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16525)
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_id_seq OWNER TO postgres;

--
-- TOC entry 5045 (class 0 OID 0)
-- Dependencies: 225
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- TOC entry 230 (class 1259 OID 16573)
-- Name: service_reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.service_reviews (
    id integer NOT NULL,
    reviewer_id integer,
    provider_id integer,
    rating integer,
    review_text text,
    provider_reply text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT service_reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.service_reviews OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16572)
-- Name: service_reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.service_reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.service_reviews_id_seq OWNER TO postgres;

--
-- TOC entry 5046 (class 0 OID 0)
-- Dependencies: 229
-- Name: service_reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.service_reviews_id_seq OWNED BY public.service_reviews.id;


--
-- TOC entry 228 (class 1259 OID 16555)
-- Name: services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.services (
    id integer NOT NULL,
    provider_id integer,
    service_name character varying(100) NOT NULL,
    category character varying(50),
    starting_price numeric(10,2) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.services OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16554)
-- Name: services_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.services_id_seq OWNER TO postgres;

--
-- TOC entry 5047 (class 0 OID 0)
-- Dependencies: 227
-- Name: services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;


--
-- TOC entry 220 (class 1259 OID 16468)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    full_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    reputation_score integer DEFAULT 100,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_provider boolean DEFAULT false,
    provider_title character varying(100),
    experience_years integer DEFAULT 0,
    completed_jobs integer DEFAULT 0,
    hourly_rate numeric(10,2) DEFAULT 0.00,
    provider_description text,
    availability character varying(50) DEFAULT 'Available'::character varying,
    average_rating numeric(3,2) DEFAULT 0.00,
    total_reviews integer DEFAULT 0,
    service_category character varying(100),
    skills text,
    phone_number character varying(20),
    location character varying(100),
    profile_photo character varying(255)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16467)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5048 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4844 (class 2604 OID 16488)
-- Name: listings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listings ALTER COLUMN id SET DEFAULT nextval('public.listings_id_seq'::regclass);


--
-- TOC entry 4847 (class 2604 OID 16507)
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- TOC entry 4849 (class 2604 OID 16529)
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- TOC entry 4853 (class 2604 OID 16576)
-- Name: service_reviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_reviews ALTER COLUMN id SET DEFAULT nextval('public.service_reviews_id_seq'::regclass);


--
-- TOC entry 4851 (class 2604 OID 16558)
-- Name: services id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);


--
-- TOC entry 4834 (class 2604 OID 16471)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5029 (class 0 OID 16485)
-- Dependencies: 222
-- Data for Name: listings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.listings (id, user_id, title, description, price, image_url, status, created_at) FROM stdin;
2	3	induction stove	It is used for 6 months only	300.00	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3w2UrLVrDeIvtV22-HxSjJCkDC_35pdvUAza7Rscj2g&s=10	active	2026-07-21 00:28:57.256101
3	3	Cooler	This cooler not used yet \n	200.00	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRK-J-oA4bDykXzEna678e3t-MkNBnoTMbbNUQLNsgrcQ&s=10	active	2026-07-21 10:21:19.435879
4	6	shoes	New Brand shoes \nI used it for only one month	100.00	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8Jh3suDGgVSFV98J4YPZYAWizR3oNFnCNOHat_O1NuA&s=10	active	2026-07-21 10:57:10.508678
5	3	phone	 ,vj ,gujkmiy	100.00	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThl2vDuGj799MVrnBCQHpR5CfTDbIgWdDVakCLHUkaSw&s=10	active	2026-07-21 15:24:18.862002
\.


--
-- TOC entry 5031 (class 0 OID 16504)
-- Dependencies: 224
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, sender_id, receiver_id, content, created_at) FROM stdin;
2	1	2	Hi, Is this item available?	2026-07-20 23:17:40.721666
3	3	3	hi	2026-07-21 00:29:28.63469
4	4	3	Hi	2026-07-21 00:30:30.498569
5	4	3	I want to buy this at 250	2026-07-21 00:30:46.02473
6	5	3	Hi	2026-07-21 00:32:55.750179
7	5	3	fsdsdfasdf	2026-07-21 00:32:58.616357
8	3	3	sfsfs	2026-07-21 00:33:31.534296
9	5	3	bkashfk	2026-07-21 09:16:00.497543
10	5	3	Hi	2026-07-21 10:22:30.404765
11	5	3	I want to buy this cooler	2026-07-21 10:22:40.102593
12	6	6	Hi	2026-07-21 10:52:06.131203
13	6	6	I want to repair my laptop 	2026-07-21 10:52:21.406152
14	3	6	hi	2026-07-21 10:53:11.608421
15	3	6	i want to repair my laptop 	2026-07-21 10:53:27.821076
16	3	6	could you please do that	2026-07-21 10:53:38.771078
17	4	3	Hi	2026-07-21 14:23:33.644894
\.


--
-- TOC entry 5033 (class 0 OID 16526)
-- Dependencies: 226
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, reviewer_id, reviewee_id, rating, review_text, created_at) FROM stdin;
\.


--
-- TOC entry 5037 (class 0 OID 16573)
-- Dependencies: 230
-- Data for Name: service_reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.service_reviews (id, reviewer_id, provider_id, rating, review_text, provider_reply, created_at) FROM stdin;
\.


--
-- TOC entry 5035 (class 0 OID 16555)
-- Dependencies: 228
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.services (id, provider_id, service_name, category, starting_price, description, created_at) FROM stdin;
\.


--
-- TOC entry 5027 (class 0 OID 16468)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, full_name, email, password_hash, reputation_score, created_at, is_provider, provider_title, experience_years, completed_jobs, hourly_rate, provider_description, availability, average_rating, total_reviews, service_category, skills, phone_number, location, profile_photo) FROM stdin;
1	Srinivas	srinivas@gmail.com	$2b$10$qpPQ4uIyRYOZUb42tKbfiOdiYrtGhMKwVucKaVrm7/hh6SyCqR5OO	100	2026-07-20 22:35:32.048809	f	\N	0	0	0.00	\N	Available	0.00	0	\N	\N	\N	\N	\N
2	Rahul	rahul@gmail.com	$2b$10$f5N43T8vRdZub.CAzjyOH.FJgNxh8mh/kXTa1TRqWjJji3y1HuDXS	100	2026-07-20 23:16:27.644094	f	\N	0	0	0.00	\N	Available	0.00	0	\N	\N	\N	\N	\N
3	Ballapalli Srinivasulu	ssrinu7568@gmail.com	$2b$10$lIwA/8O8mzJrx.EKJLFACeLcJ8HLUeEYX1IomGg9ZzM4V5cVcrI1O	100	2026-07-21 00:26:55.097641	f	\N	0	0	0.00	\N	Available	0.00	0	\N	\N	\N	\N	\N
4	shiva	ssri6300650@gmail.com	$2b$10$emOHVtAbuFgV4cuhcNwFMOvawaGFlOY2urVSzp5qIPsUnYJ82h8Lm	100	2026-07-21 00:30:05.966204	f	\N	0	0	0.00	\N	Available	0.00	0	\N	\N	\N	\N	\N
5	anil	placements@mits.ac.in	$2b$10$XNwMRRT60FCOS/DJAMhrQ.AnjwuBi9.aJELjx4wvhDR8T3pFViKVe	100	2026-07-21 00:32:38.370808	f	\N	0	0	0.00	\N	Available	0.00	0	\N	\N	\N	\N	\N
6	shiva shankar	shiva9999@gmail.com	$2b$10$w6V52gqUKdKY/Iy3vOEcreHPAIwMInKuIDOEkvhiGMAznqnEKqwni	100	2026-07-21 10:24:36.911347	t	Master in Laptop Functional's	2	0	10.00	I worked in tcs company as non-tech role	Available	0.00	0	Laptop Repair	Clean the software, Install the required libraries , functional's of components	1234567895	Angallu	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn1T4EAYle5QgehCzMKOjTun3sugyZNlQcrPrskA-UbA&s=10
\.


--
-- TOC entry 5049 (class 0 OID 0)
-- Dependencies: 221
-- Name: listings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.listings_id_seq', 5, true);


--
-- TOC entry 5050 (class 0 OID 0)
-- Dependencies: 223
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_id_seq', 17, true);


--
-- TOC entry 5051 (class 0 OID 0)
-- Dependencies: 225
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_id_seq', 1, false);


--
-- TOC entry 5052 (class 0 OID 0)
-- Dependencies: 229
-- Name: service_reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.service_reviews_id_seq', 1, false);


--
-- TOC entry 5053 (class 0 OID 0)
-- Dependencies: 227
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.services_id_seq', 1, false);


--
-- TOC entry 5054 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 6, true);


--
-- TOC entry 4862 (class 2606 OID 16497)
-- Name: listings listings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_pkey PRIMARY KEY (id);


--
-- TOC entry 4864 (class 2606 OID 16514)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- TOC entry 4866 (class 2606 OID 16536)
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- TOC entry 4870 (class 2606 OID 16583)
-- Name: service_reviews service_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_reviews
    ADD CONSTRAINT service_reviews_pkey PRIMARY KEY (id);


--
-- TOC entry 4868 (class 2606 OID 16566)
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- TOC entry 4858 (class 2606 OID 16483)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4860 (class 2606 OID 16481)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4871 (class 2606 OID 16498)
-- Name: listings listings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4872 (class 2606 OID 16520)
-- Name: messages messages_receiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4873 (class 2606 OID 16515)
-- Name: messages messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4874 (class 2606 OID 16542)
-- Name: reviews reviews_reviewee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_reviewee_id_fkey FOREIGN KEY (reviewee_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4875 (class 2606 OID 16537)
-- Name: reviews reviews_reviewer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4877 (class 2606 OID 16589)
-- Name: service_reviews service_reviews_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_reviews
    ADD CONSTRAINT service_reviews_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4878 (class 2606 OID 16584)
-- Name: service_reviews service_reviews_reviewer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_reviews
    ADD CONSTRAINT service_reviews_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4876 (class 2606 OID 16567)
-- Name: services services_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2026-07-21 19:19:26

--
-- PostgreSQL database dump complete
--

\unrestrict KKy5FyOONKKhrMyQKGO1h1g9sv4UirQmfGfZqLrkx0L62LtXRsO2CX5BiaBw3Dw

