--
-- PostgreSQL database dump
--

-- Dumped from database version 13.3
-- Dumped by pg_dump version 13.3

-- Started on 2023-05-28 22:50:26

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- TOC entry 205 (class 1259 OID 45632)
-- Name: Category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Category" (
    category_id integer NOT NULL,
    category_name character varying(50) NOT NULL
);


ALTER TABLE public."Category" OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 45630)
-- Name: Category_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Category_category_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Category_category_id_seq" OWNER TO postgres;

--
-- TOC entry 3088 (class 0 OID 0)
-- Dependencies: 204
-- Name: Category_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Category_category_id_seq" OWNED BY public."Category".category_id;


--
-- TOC entry 201 (class 1259 OID 45606)
-- Name: ClientUser; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ClientUser" (
    client_id integer NOT NULL,
    client_name character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    phone_number character varying(20) NOT NULL,
    billing_address character varying(100) NOT NULL
);


ALTER TABLE public."ClientUser" OWNER TO postgres;

--
-- TOC entry 200 (class 1259 OID 45604)
-- Name: ClientUser_client_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ClientUser_client_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ClientUser_client_id_seq" OWNER TO postgres;

--
-- TOC entry 3089 (class 0 OID 0)
-- Dependencies: 200
-- Name: ClientUser_client_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ClientUser_client_id_seq" OWNED BY public."ClientUser".client_id;


--
-- TOC entry 211 (class 1259 OID 45674)
-- Name: Order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Order" (
    order_id integer NOT NULL,
    client_id integer NOT NULL,
    supplier_id integer NOT NULL,
    total_cost double precision DEFAULT 0 NOT NULL,
    order_notes character varying(300) DEFAULT ''::character varying NOT NULL,
    purchase_date date DEFAULT CURRENT_DATE NOT NULL,
    delivery_date date DEFAULT (CURRENT_DATE + 5) NOT NULL,
    state_id integer DEFAULT 1 NOT NULL,
    CONSTRAINT "Order_total_cost_check" CHECK ((total_cost > ('-1'::integer)::double precision))
);


ALTER TABLE public."Order" OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 45666)
-- Name: OrderState; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OrderState" (
    state_id integer NOT NULL,
    state_name character varying(50) NOT NULL
);


ALTER TABLE public."OrderState" OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 45703)
-- Name: OrderStateUpdate; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OrderStateUpdate" (
    order_id integer NOT NULL,
    original_state_id integer NOT NULL,
    new_state_id integer NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."OrderStateUpdate" OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 45701)
-- Name: OrderStateUpdate_order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."OrderStateUpdate_order_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."OrderStateUpdate_order_id_seq" OWNER TO postgres;

--
-- TOC entry 3090 (class 0 OID 0)
-- Dependencies: 212
-- Name: OrderStateUpdate_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."OrderStateUpdate_order_id_seq" OWNED BY public."OrderStateUpdate".order_id;


--
-- TOC entry 208 (class 1259 OID 45664)
-- Name: OrderState_state_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."OrderState_state_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."OrderState_state_id_seq" OWNER TO postgres;

--
-- TOC entry 3091 (class 0 OID 0)
-- Dependencies: 208
-- Name: OrderState_state_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."OrderState_state_id_seq" OWNED BY public."OrderState".state_id;


--
-- TOC entry 210 (class 1259 OID 45672)
-- Name: Order_order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Order_order_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Order_order_id_seq" OWNER TO postgres;

--
-- TOC entry 3092 (class 0 OID 0)
-- Dependencies: 210
-- Name: Order_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Order_order_id_seq" OWNED BY public."Order".order_id;


--
-- TOC entry 207 (class 1259 OID 45640)
-- Name: Product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Product" (
    product_id integer NOT NULL,
    product_name character varying(50) NOT NULL,
    description character varying(1000) NOT NULL,
    image_url character varying(1000),
    stock integer DEFAULT 0 NOT NULL,
    total_purchases bigint DEFAULT 0 NOT NULL,
    unit_price double precision NOT NULL,
    supplier_id integer NOT NULL,
    category_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT "Product_stock_check" CHECK ((stock > '-1'::integer)),
    CONSTRAINT "Product_unit_price_check" CHECK ((unit_price > ('-1'::integer)::double precision))
);


ALTER TABLE public."Product" OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 45720)
-- Name: ProductOrder; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProductOrder" (
    product_id integer NOT NULL,
    order_id integer NOT NULL,
    amount integer NOT NULL,
    CONSTRAINT "ProductOrder_amount_check" CHECK ((amount > 0))
);


ALTER TABLE public."ProductOrder" OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 45638)
-- Name: Product_product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Product_product_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Product_product_id_seq" OWNER TO postgres;

--
-- TOC entry 3093 (class 0 OID 0)
-- Dependencies: 206
-- Name: Product_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Product_product_id_seq" OWNED BY public."Product".product_id;


--
-- TOC entry 203 (class 1259 OID 45614)
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    user_id integer NOT NULL,
    username character varying(30) NOT NULL,
    password_hash bytea NOT NULL,
    client_id integer NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 45612)
-- Name: User_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_user_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."User_user_id_seq" OWNER TO postgres;

--
-- TOC entry 3094 (class 0 OID 0)
-- Dependencies: 202
-- Name: User_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_user_id_seq" OWNED BY public."User".user_id;


--
-- TOC entry 2894 (class 2604 OID 45635)
-- Name: Category category_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category" ALTER COLUMN category_id SET DEFAULT nextval('public."Category_category_id_seq"'::regclass);


--
-- TOC entry 2892 (class 2604 OID 45609)
-- Name: ClientUser client_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ClientUser" ALTER COLUMN client_id SET DEFAULT nextval('public."ClientUser_client_id_seq"'::regclass);


--
-- TOC entry 2902 (class 2604 OID 45677)
-- Name: Order order_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order" ALTER COLUMN order_id SET DEFAULT nextval('public."Order_order_id_seq"'::regclass);


--
-- TOC entry 2901 (class 2604 OID 45669)
-- Name: OrderState state_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderState" ALTER COLUMN state_id SET DEFAULT nextval('public."OrderState_state_id_seq"'::regclass);


--
-- TOC entry 2909 (class 2604 OID 45706)
-- Name: OrderStateUpdate order_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderStateUpdate" ALTER COLUMN order_id SET DEFAULT nextval('public."OrderStateUpdate_order_id_seq"'::regclass);


--
-- TOC entry 2895 (class 2604 OID 45643)
-- Name: Product product_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product" ALTER COLUMN product_id SET DEFAULT nextval('public."Product_product_id_seq"'::regclass);


--
-- TOC entry 2893 (class 2604 OID 45617)
-- Name: User user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN user_id SET DEFAULT nextval('public."User_user_id_seq"'::regclass);


--
-- TOC entry 3073 (class 0 OID 45632)
-- Dependencies: 205
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Category" VALUES (1, 'Vehicle');
INSERT INTO public."Category" VALUES (2, 'Clothing');
INSERT INTO public."Category" VALUES (3, 'Accessories');
INSERT INTO public."Category" VALUES (4, 'Sports');
INSERT INTO public."Category" VALUES (5, 'Home');
INSERT INTO public."Category" VALUES (6, 'Garden');
INSERT INTO public."Category" VALUES (7, 'Toys');
INSERT INTO public."Category" VALUES (8, 'Business');
INSERT INTO public."Category" VALUES (9, 'Industrial');
INSERT INTO public."Category" VALUES (10, 'Health');
INSERT INTO public."Category" VALUES (11, 'Pets');
INSERT INTO public."Category" VALUES (12, 'Electronics');
INSERT INTO public."Category" VALUES (13, 'School');
INSERT INTO public."Category" VALUES (14, 'Art');


--
-- TOC entry 3069 (class 0 OID 45606)
-- Dependencies: 201
-- Data for Name: ClientUser; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."ClientUser" VALUES (0, 'None', 'None', 'None', 'None');
INSERT INTO public."ClientUser" VALUES (1, 'David Eduardo Díaz de Moya', 'dd@email.com', '+57 329023490', '1734 Easyshop Road, Barranquilla, Colombia');
INSERT INTO public."ClientUser" VALUES (2, 'SAMSUNG', 'samsung@email.com', '+57 316 8310338', 'Cra. 51B #87-50, Barranquilla, Colombia.');
INSERT INTO public."ClientUser" VALUES (3, 'Adidas', 'adidas@email.com', '+1 123 492 3094', 'http://localhost:8080/login');
INSERT INTO public."ClientUser" VALUES (4, 'Netflix', 'netflix@email.com', '+1 32984535', '1239 Netflix Rd');
INSERT INTO public."ClientUser" VALUES (5, 'User 237845', 'user@email.com', '3129474853', '734 West Easyshop Road');
INSERT INTO public."ClientUser" VALUES (6, 'Natalia', 'natalia@email.com', '+57 3492589345', '12734 Easy Shopo East Road');
INSERT INTO public."ClientUser" VALUES (7, 'David Henriquez', 'dh@email.com', '+5 123473845', '3475 Easyshop Road');


--
-- TOC entry 3079 (class 0 OID 45674)
-- Dependencies: 211
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Order" VALUES (1, 7, 5, 239.88, ': )', '2023-05-28', '2023-06-02', 1);
INSERT INTO public."Order" VALUES (2, 7, 1, 699.96, ': )', '2023-05-28', '2023-06-02', 1);
INSERT INTO public."Order" VALUES (3, 7, 5, 239.88, '', '2023-05-28', '2023-06-02', 1);
INSERT INTO public."Order" VALUES (4, 7, 1, 2449.86, '', '2023-05-28', '2023-06-02', 1);
INSERT INTO public."Order" VALUES (5, 7, 2, 6579.95, '', '2023-05-28', '2023-06-02', 1);
INSERT INTO public."Order" VALUES (6, 7, 5, 279.85999999999996, '', '2023-05-28', '2023-06-02', 1);
INSERT INTO public."Order" VALUES (7, 7, 1, 2449.86, '', '2023-05-28', '2023-06-02', 1);
INSERT INTO public."Order" VALUES (8, 7, 2, 6579.95, '', '2023-05-28', '2023-06-02', 1);


--
-- TOC entry 3077 (class 0 OID 45666)
-- Dependencies: 209
-- Data for Name: OrderState; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."OrderState" VALUES (1, 'Confirmed');
INSERT INTO public."OrderState" VALUES (2, 'Dispatched');
INSERT INTO public."OrderState" VALUES (3, 'Delivered');
INSERT INTO public."OrderState" VALUES (4, 'Canceled');


--
-- TOC entry 3081 (class 0 OID 45703)
-- Dependencies: 213
-- Data for Name: OrderStateUpdate; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3075 (class 0 OID 45640)
-- Dependencies: 207
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Product" VALUES (5, 'Adidas Men''s Ultraboost 22 Running Shoe', '100% Synthetic
Imported
Rubber sole
Men''s high-performance running shoes with a smooth, flexible ride
ADIDAS PRIMEKNIT: Foot-hugging upper that wraps the foot with a supportive fit to enhance movement
CAN''T STOP. WON''T STOP: The incredible energy return of adidas BOOST is created by fusing together energy capsules, giving you the power to keep your feet moving
STRETCHWEB WITH CONTINENTAL RUBBER OUTSOLE: Stretchweb outsole flexes naturally for an energized ride, and Continental Rubber gives you superior traction; Officially licensed Continental product
PARLEY OCEAN PLASTIC: This shoe''s upper is made with a high-performance yarn which contains at least 50% Parley Ocean Plastic — reimagined plastic waste, intercepted on beaches, coastal communities and shorelines, preventing it from polluting our ocean', '/img/f21f835be1fa42ccbacc1243d918dc0d.jpg', 0, 0, 144.99, 3, 2, '2023-05-28 18:00:14.693845');
INSERT INTO public."Product" VALUES (7, 'Cars', 'Lightning McQueen is living in the fast lane, until he hits a detour and gets stranded in Radiator Springs, a forgotten town on Route 66. There he meets a heap of hilarious characters who help him discover there''s more to life than fame.', '/img/d6a1a064423f43b286143be99abfcc73.jpg', 0, 0, 3, 4, 1, '2023-05-28 18:05:20.028554');
INSERT INTO public."Product" VALUES (8, 'Nctoberows 76-Pack Drawing Set Sketching Kit', '✨【Professional Drawing Sketching Set】The art supplies drawing kit is suit for artists of all skill levels. It contains all the art pencils you need,Variety of pencil types and Vivid Color for you to do any artworks. Perfect for drawing, sketching, shading, layering, blending, and more.
✨15 Graphite Drawing Sketching Pencils (12B,10B, 8B, 6B, 5B, 4B, 3B, 2B, B, HB, F, 2H, 3H, 4H, 5H ), 1 3-Color Sketchbook, 36 PCS Colored Pencils, 12 PCS Charcoal Pencils, 1 Pencil Extender, 1 Refillable Water Brush Pen, 1 Vinyl Eraser, 1 Kneaded Eraser, 1 Sandpaper Block, 3 Paper Blending Stumps,1 Paintbrush,1 Marker Pen,1 Sharpener,1 Pencil Case
✨【Unique 3-Color Sketch Pad】The 3-Color Sketchbook is 6 x 9", spiral bond, 100GSM, 50 pages (30 pages white, 10 pages toned tan, 10 pages black), the 3 colors of sketch paper are suitable for different styles of sketching needs, no need to spend more money to buy different colors of sketchbooks.', '/img/f3a9d33d14854c69ae96d92d17bc141e.jpg', 962, 38, 19.99, 5, 14, '2023-05-28 18:07:35.735515');
INSERT INTO public."Product" VALUES (3, 'SAMSUNG 14” Galaxy Book3 Pro Laptop Computer.', 'CAREER ACCELERATING SPEED: Strivers and thrivers, this is the PC laptop for you; Accomplish your ambitions with a powerful processor that’s the latest design by Intel — ideal for fast-paced lifestyles
THIN, LIGHT, PREMIUM DESIGN: Go ahead, live that fast-paced life — Galaxy Book3 Pro won’t slow you down; Featuring a slim, lightweight design that’s made to move with you, this powerful PC is always ready to help you pursue your ambitions
A SCREEN LIKE YOU’VE NEVER SEEN: Experience jaw-dropping clarity on a 3K AMOLED display, available in two sizes (14-inch and 16-inch); See more content with a super wide 16:10 aspect ratio, the largest ever for a Galaxy*
POWER TO POWER THROUGH: Get your hustle on all day long with a powerful battery; Designed for self-starters and go-getters, this long lasting charge** keeps up with hardworking early birds who double as night owls', '/img/b7f23d74829b44cab47e46b0dcc74f18.jpg', 990, 10, 1315.99, 2, 12, '2023-05-28 17:54:14.45279');
INSERT INTO public."Product" VALUES (9, 'Camera', 'Portable Camera', '/img/a60c85b6314a4a829869acf34bd92df7.png', 0, 0, 50, 7, 12, '2023-05-28 18:53:40.909367');
INSERT INTO public."Product" VALUES (1, 'ANMESC Laptop, 15.6" 1080P Full HD Display', '🚀【HIGH PERFORMANCE LAPTOP】ANMESC 15.6 inch laptop uses powerful Intel Celeron N5095 processor, frequency up to 2.9GHz, no latency, and powerful and faster than normal processors on the basic frequency. Equipped with the latest pre-installed Windows 11 system which is far more safer and faster than previous Windows systems. The perfect combination of performance, power consumption, and helps your device run smoothly and reliably to handle all your tasks.
🚩【LARGE SORAGE SAPCE COMPUTER】ANMESC LT1504 Laptop is equipped with 12GB DDR4 and 512GB high-speed SSD which lets you use it without a problem even with multi programs open. Provides huge space for efficient operation of the most complex application and multimedia. An expandable TF card slot supports maximum 512GB TF card expansion and extensive interfaces such as HDMI, 2xUSB 3.0, USB Type-C, etc. Ensures you of an enough space to create and store more of your world.
', '/img/3147d4fc03cd4db0a39ac9db2e530b1e.png', 984, 16, 349.98, 1, 12, '2023-05-28 17:48:43.073006');


--
-- TOC entry 3082 (class 0 OID 45720)
-- Dependencies: 214
-- Data for Name: ProductOrder; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."ProductOrder" VALUES (8, 1, 12);
INSERT INTO public."ProductOrder" VALUES (1, 2, 2);
INSERT INTO public."ProductOrder" VALUES (8, 3, 12);
INSERT INTO public."ProductOrder" VALUES (1, 4, 7);
INSERT INTO public."ProductOrder" VALUES (3, 5, 5);
INSERT INTO public."ProductOrder" VALUES (8, 6, 14);
INSERT INTO public."ProductOrder" VALUES (1, 7, 7);
INSERT INTO public."ProductOrder" VALUES (3, 8, 5);


--
-- TOC entry 3071 (class 0 OID 45614)
-- Dependencies: 203
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."User" VALUES (1, 'ddiaz', '\x2432622431322461427553633853536f38456f30636a6d657342314f75346b456938586f4a492f465957494b795a74566f34496636334536596f4865', 1);
INSERT INTO public."User" VALUES (2, 'samsung', '\x2432622431322459533666643449464439496d306f6c2e4656654c66654b624748305551636e4351714b30335138386b4b7a5277586d364674396457', 2);
INSERT INTO public."User" VALUES (3, 'adidas', '\x2432622431322456682e554e577574324f4e4d544a526c674b4e6b3075306d6f324f4a4e44347a6276786f7549785351555467315a4a4f2f34314a53', 3);
INSERT INTO public."User" VALUES (4, 'netflix', '\x24326224313224542f5176475462584b4d79726b526f6c57494b69612e7873746c4e4e326a664e776c357a4644466671706658665131796b346a742e', 4);
INSERT INTO public."User" VALUES (5, 'user', '\x24326224313224565268646e64576a6a315548577656534c5542587865546d726b5a4f484731437032425346713436375277387a4e766570796c2e4f', 5);
INSERT INTO public."User" VALUES (6, 'natalia', '\x243262243132244c44624a516779716159716e734e503934427a6a614f6164475157696434617274687772693466522e376364516959326f7470314b', 6);
INSERT INTO public."User" VALUES (7, 'dh', '\x2432622431322468322e43566a753750536f6c434768316a544b6e4c65722e47467055496e32326433774b4d72705947766b31756f2f563946343761', 7);


--
-- TOC entry 3095 (class 0 OID 0)
-- Dependencies: 204
-- Name: Category_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Category_category_id_seq"', 14, true);


--
-- TOC entry 3096 (class 0 OID 0)
-- Dependencies: 200
-- Name: ClientUser_client_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ClientUser_client_id_seq"', 7, true);


--
-- TOC entry 3097 (class 0 OID 0)
-- Dependencies: 212
-- Name: OrderStateUpdate_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."OrderStateUpdate_order_id_seq"', 1, false);


--
-- TOC entry 3098 (class 0 OID 0)
-- Dependencies: 208
-- Name: OrderState_state_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."OrderState_state_id_seq"', 4, true);


--
-- TOC entry 3099 (class 0 OID 0)
-- Dependencies: 210
-- Name: Order_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Order_order_id_seq"', 8, true);


--
-- TOC entry 3100 (class 0 OID 0)
-- Dependencies: 206
-- Name: Product_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Product_product_id_seq"', 9, true);


--
-- TOC entry 3101 (class 0 OID 0)
-- Dependencies: 202
-- Name: User_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_user_id_seq"', 7, true);


--
-- TOC entry 2919 (class 2606 OID 45637)
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (category_id);


--
-- TOC entry 2913 (class 2606 OID 45611)
-- Name: ClientUser ClientUser_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ClientUser"
    ADD CONSTRAINT "ClientUser_pkey" PRIMARY KEY (client_id);


--
-- TOC entry 2927 (class 2606 OID 45709)
-- Name: OrderStateUpdate OrderStateUpdate_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderStateUpdate"
    ADD CONSTRAINT "OrderStateUpdate_pkey" PRIMARY KEY (order_id);


--
-- TOC entry 2923 (class 2606 OID 45671)
-- Name: OrderState OrderState_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderState"
    ADD CONSTRAINT "OrderState_pkey" PRIMARY KEY (state_id);


--
-- TOC entry 2925 (class 2606 OID 45685)
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (order_id);


--
-- TOC entry 2921 (class 2606 OID 45653)
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (product_id);


--
-- TOC entry 2915 (class 2606 OID 45622)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (user_id);


--
-- TOC entry 2917 (class 2606 OID 45624)
-- Name: User User_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_username_key" UNIQUE (username);


--
-- TOC entry 2935 (class 2606 OID 45715)
-- Name: OrderStateUpdate OrderStateUpdate_new_state_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderStateUpdate"
    ADD CONSTRAINT "OrderStateUpdate_new_state_id_fkey" FOREIGN KEY (new_state_id) REFERENCES public."OrderState"(state_id);


--
-- TOC entry 2934 (class 2606 OID 45710)
-- Name: OrderStateUpdate OrderStateUpdate_original_state_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderStateUpdate"
    ADD CONSTRAINT "OrderStateUpdate_original_state_id_fkey" FOREIGN KEY (original_state_id) REFERENCES public."OrderState"(state_id);


--
-- TOC entry 2931 (class 2606 OID 45686)
-- Name: Order Order_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_client_id_fkey" FOREIGN KEY (client_id) REFERENCES public."ClientUser"(client_id);


--
-- TOC entry 2933 (class 2606 OID 45696)
-- Name: Order Order_state_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_state_id_fkey" FOREIGN KEY (state_id) REFERENCES public."OrderState"(state_id);


--
-- TOC entry 2932 (class 2606 OID 45691)
-- Name: Order Order_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_supplier_id_fkey" FOREIGN KEY (supplier_id) REFERENCES public."ClientUser"(client_id);


--
-- TOC entry 2937 (class 2606 OID 45729)
-- Name: ProductOrder ProductOrder_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductOrder"
    ADD CONSTRAINT "ProductOrder_order_id_fkey" FOREIGN KEY (order_id) REFERENCES public."Order"(order_id);


--
-- TOC entry 2936 (class 2606 OID 45724)
-- Name: ProductOrder ProductOrder_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductOrder"
    ADD CONSTRAINT "ProductOrder_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public."Product"(product_id);


--
-- TOC entry 2930 (class 2606 OID 45659)
-- Name: Product Product_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public."Category"(category_id);


--
-- TOC entry 2929 (class 2606 OID 45654)
-- Name: Product Product_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_supplier_id_fkey" FOREIGN KEY (supplier_id) REFERENCES public."ClientUser"(client_id);


--
-- TOC entry 2928 (class 2606 OID 45625)
-- Name: User User_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_client_id_fkey" FOREIGN KEY (client_id) REFERENCES public."ClientUser"(client_id) ON DELETE CASCADE;


-- Completed on 2023-05-28 22:50:27

--
-- PostgreSQL database dump complete
--

