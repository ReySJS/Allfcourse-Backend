CREATE TABLE public.users (
	"id" serial NOT NULL,
	"first_name" varchar(80) NOT NULL,
	"last_name" varchar(80) NOT NULL,
	"social_name" varchar(30),
	"document" varchar(14) NOT NULL UNIQUE,
	"email" varchar(80) NOT NULL UNIQUE,
	"phone" numeric NOT NULL UNIQUE,
	"password" varchar(60) NOT NULL,
	"gender" varchar(30) NOT NULL,
	"birth_date" DATE NOT NULL,
	"profile_photo" TEXT,
	"recover_token" varchar(64),
	"rtoken_expire" timestamp with time zone,
	"email_token" varchar(64),
	"etoken_expire" timestamp with time zone,
	"type" int NOT NULL DEFAULT(1),
	"active" BOOLEAN NOT NULL,
	"created_at" timestamp with time zone NOT NULL DEFAULT(timezone('America/Sao_Paulo'::text, now())),
	"deleted_by" integer NULL,
	"deleted_at" timestamp with time zone NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public.classes (
	"id" serial NOT NULL,
	"module_id" integer NOT NULL,
	"class_order" integer NOT NULL,
	"video_link" varchar(255) NOT NULL,
	"name" varchar(80) NOT NULL,
	"description" TEXT NOT NULL,
	"inactive" BOOLEAN NOT NULL,
	"created_at" timestamp with time zone NOT NULL DEFAULT(timezone('America/Sao_Paulo'::text, now())),
	"deleted_at" timestamp with time zone NULL,
	CONSTRAINT "classes_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public.courses (
	"id" serial NOT NULL,
	"teacher_id" int NOT NULL,
	"name" varchar(80) NOT NULL,
	"description" TEXT NOT NULL,
	"banner_img" varchar NOT NULL,
	"price" DECIMAL(10,2) NOT NULL,
	"status" varchar(20) NOT NULL,
	"created_at" timestamp with time zone NOT NULL DEFAULT(timezone('America/Sao_Paulo'::text, now())),
	"s_updated_by" integer NULL,
	"updated_at" timestamp with time zone,
	"deleted_by" integer NULL,
	"deleted_at" timestamp with time zone NULL,
	CONSTRAINT "courses_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public.courses_categories (
	"id" serial NOT NULL,
	"name" varchar(30) NOT NULL,
	"created_by" integer NOT NULL,
	"created_at" timestamp with time zone NOT NULL DEFAULT(timezone('America/Sao_Paulo'::text, now())),
	"deleted_by" integer NULL,
	"deleted_at" timestamp with time zone NULL,
	CONSTRAINT "courses_categories_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public.enroll_students (
	"id" serial NOT NULL,
	"student_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	"finished" BOOLEAN NOT NULL,
	"finished_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL DEFAULT(timezone('America/Sao_Paulo'::text, now())),
	"deleted_at" timestamp with time zone NULL,
	CONSTRAINT "enroll_students_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public.class_progress (
	"id" serial NOT NULL,
	"student_id" integer NOT NULL,
	"class_id" integer NOT NULL,
	"watched_time" timestamp with time zone NOT NULL,
	CONSTRAINT "class_progress_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public.user_logs (
	"id" serial NOT NULL,
	"description" TEXT NOT NULL,
	CONSTRAINT "user_logs_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public.modules (
	"id" serial NOT NULL,
	"name" varchar(80) NOT NULL,
	"description" TEXT NOT NULL,
	"created_at" timestamp with time zone NOT NULL DEFAULT(timezone('America/Sao_Paulo'::text, now())),
	"deleted_at" timestamp with time zone NULL,
	CONSTRAINT "modules_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public.courses_flags (
	"id" serial NOT NULL UNIQUE,
	"course_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	"created_by" integer NOT NULL,
	"created_at" timestamp with time zone NOT NULL DEFAULT(timezone('America/Sao_Paulo'::text, now())),
	"deleted_by" integer NULL,
	"deleted_at" timestamp with time zone NULL,
	CONSTRAINT "courses_flags_pk" PRIMARY KEY ("course_id","category_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public.module_order (
	"id" serial NOT NULL UNIQUE,
	"course_id" integer NOT NULL,
	"module_id" integer NOT NULL,
	"module_order" int NOT NULL,
	CONSTRAINT "module_order_pk" PRIMARY KEY ("course_id","module_id","module_order")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public.sales (
	"id" serial NOT NULL,
	"course_id" integer NOT NULL,
	"student_id" integer NOT NULL,
	"release_date" DATE NOT NULL,
	"payment_method_id" integer NOT NULL,
	"price" DECIMAL(10,2) NOT NULL,
	"created_at" timestamp with time zone NOT NULL DEFAULT(timezone('America/Sao_Paulo'::text, now())),
	"deleted_by" integer,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "sales_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public.financial_transfer (
	"id" serial NOT NULL UNIQUE,
	"sale_id" integer NOT NULL,
	"teacher_id" integer NOT NULL,
	"price" DECIMAL(10,2) NOT NULL,
	"due_date" DATE NOT NULL,
	"pay_date" DATE,
	"created_at" timestamp with time zone NOT NULL DEFAULT(timezone('America/Sao_Paulo'::text, now())),
	"deleted_by" integer,
	"deleted_at" timestamp with time zone NULL,
	CONSTRAINT "financial_transfer_pk" PRIMARY KEY ("sale_id","teacher_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public.receive_bills (
	"id" serial NOT NULL UNIQUE,
	"sale_id" integer NOT NULL,
	"installment" integer NOT NULL,
	"subtotal" DECIMAL(10,2) NOT NULL,
	"due_date" DATE NOT NULL,
	"pay_date" DATE,
	"created_at" timestamp with time zone NOT NULL DEFAULT(timezone('America/Sao_Paulo'::text, now())),
	"deleted_by" integer,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "receive_bills_pk" PRIMARY KEY ("sale_id","installment")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public.payment_method (
	"id" serial NOT NULL,
	"name" varchar(30) NOT NULL,
	"installments" integer NOT NULL,
    "deleted_at" timestamp with time zone,
	CONSTRAINT "payment_method_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public.req_refunds (
	"id" serial NOT NULL,
	"sale_id" integer NOT NULL,
	"reason" TEXT NOT NULL,
	"status" varchar(13) NOT NULL,
	"created_at" timestamp with time zone NOT NULL DEFAULT(timezone('America/Sao_Paulo'::text, now())),
	"s_updated_by" integer NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "req_refunds_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



ALTER TABLE users ADD CONSTRAINT "users_fk0" FOREIGN KEY ("deleted_by") REFERENCES users("id");

ALTER TABLE classes ADD CONSTRAINT "classes_fk0" FOREIGN KEY ("module_id") REFERENCES modules("id");

ALTER TABLE courses ADD CONSTRAINT "courses_fk0" FOREIGN KEY ("teacher_id") REFERENCES users("id");
ALTER TABLE courses ADD CONSTRAINT "courses_fk1" FOREIGN KEY ("s_updated_by") REFERENCES users("id");
ALTER TABLE courses ADD CONSTRAINT "courses_fk2" FOREIGN KEY ("deleted_by") REFERENCES users("id");

ALTER TABLE courses_categories ADD CONSTRAINT "courses_categories_fk0" FOREIGN KEY ("created_by") REFERENCES users("id");
ALTER TABLE courses_categories ADD CONSTRAINT "courses_categories_fk1" FOREIGN KEY ("deleted_by") REFERENCES users("id");

ALTER TABLE enroll_students ADD CONSTRAINT "enroll_students_fk0" FOREIGN KEY ("student_id") REFERENCES users("id");
ALTER TABLE enroll_students ADD CONSTRAINT "enroll_students_fk1" FOREIGN KEY ("course_id") REFERENCES courses("id");

ALTER TABLE class_progress ADD CONSTRAINT "class_progress_fk0" FOREIGN KEY ("student_id") REFERENCES users("id");
ALTER TABLE class_progress ADD CONSTRAINT "class_progress_fk1" FOREIGN KEY ("class_id") REFERENCES classes("id");



ALTER TABLE courses_flags ADD CONSTRAINT "courses_flags_fk0" FOREIGN KEY ("course_id") REFERENCES courses("id");
ALTER TABLE courses_flags ADD CONSTRAINT "courses_flags_fk1" FOREIGN KEY ("category_id") REFERENCES courses_categories("id");
ALTER TABLE courses_flags ADD CONSTRAINT "courses_flags_fk2" FOREIGN KEY ("created_by") REFERENCES users("id");
ALTER TABLE courses_flags ADD CONSTRAINT "courses_flags_fk3" FOREIGN KEY ("deleted_by") REFERENCES users("id");

ALTER TABLE module_order ADD CONSTRAINT "module_order_fk0" FOREIGN KEY ("course_id") REFERENCES courses("id");
ALTER TABLE module_order ADD CONSTRAINT "module_order_fk1" FOREIGN KEY ("module_id") REFERENCES modules("id");

ALTER TABLE sales ADD CONSTRAINT "sales_fk0" FOREIGN KEY ("course_id") REFERENCES courses("id");
ALTER TABLE sales ADD CONSTRAINT "sales_fk1" FOREIGN KEY ("student_id") REFERENCES users("id");
ALTER TABLE sales ADD CONSTRAINT "sales_fk2" FOREIGN KEY ("payment_method_id") REFERENCES payment_method("id");
ALTER TABLE sales ADD CONSTRAINT "sales_fk3" FOREIGN KEY ("deleted_by") REFERENCES users("id");

ALTER TABLE financial_transfer ADD CONSTRAINT "financial_transfer_fk0" FOREIGN KEY ("sale_id") REFERENCES sales("id");
ALTER TABLE financial_transfer ADD CONSTRAINT "financial_transfer_fk1" FOREIGN KEY ("teacher_id") REFERENCES users("id");
ALTER TABLE financial_transfer ADD CONSTRAINT "financial_transfer_fk2" FOREIGN KEY ("deleted_by") REFERENCES users("id");

ALTER TABLE receive_bills ADD CONSTRAINT "receive_bills_fk0" FOREIGN KEY ("sale_id") REFERENCES sales("id");
ALTER TABLE receive_bills ADD CONSTRAINT "receive_bills_fk1" FOREIGN KEY ("deleted_by") REFERENCES users("id");


ALTER TABLE req_refunds ADD CONSTRAINT req_refunds_fk0 FOREIGN KEY ("sale_id") REFERENCES sales("id");
ALTER TABLE req_refunds ADD CONSTRAINT req_refunds_fk1 FOREIGN KEY ("s_updated_by") REFERENCES users("id");















