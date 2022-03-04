CREATE INDEX IF NOT EXISTS
	idx_class_id
	ON
	public.classes (
		  id
		, deleted_at
	);

CREATE INDEX IF NOT EXISTS
	idx_course_id
	ON
	public.courses (
		  id
		, deleted_at
	);

CREATE INDEX IF NOT EXISTS
	idx_c_categories_id
	ON
	public.courses_categories (
		  id
		, deleted_at
	);

CREATE INDEX IF NOT EXISTS
	idx_c_categories_name
	ON
	public.courses_categories (
		  name
		, deleted_at
	);

CREATE INDEX IF NOT EXISTS
	idx_c_flag_course_id
	ON
	public.courses_flags (
		  course_id
		, deleted_at
	);

CREATE INDEX IF NOT EXISTS
	idx_c_flag_category_id
	ON
	public.courses_flags (
		  category_id
		, deleted_at
	);

CREATE INDEX IF NOT EXISTS
	idx_en_student_s_id
	ON
	public.enroll_students (
		  student_id
		, deleted_at
	);

CREATE INDEX IF NOT EXISTS
	idx_en_student_c_id
	ON
	public.enroll_students (
		  course_id
		, deleted_at
	);

CREATE INDEX IF NOT EXISTS
	idx_f_transfers_teacher_id
	ON
	public.financial_transfer (
		  teacher_id
		, deleted_at
	);

CREATE INDEX IF NOT EXISTS
	idx_modules_id
	ON
	public.modules (
		  id
		, deleted_at
	);

CREATE INDEX IF NOT EXISTS
	idx_modules_c_id
	ON
	public.modules (
		  course_id
		, deleted_at
	);

CREATE INDEX IF NOT EXISTS
	idx_p_method_id
	ON
	public.payment_method (
		  id
		, deleted_at
	);

CREATE INDEX IF NOT EXISTS
    idx_r_bills_sale_id
    ON
    public.receive_bills (
          sale_id
        , deleted_at
    );


CREATE INDEX IF NOT EXISTS
    idx_sale_course_id
    ON
    public.sales (
          course_id
        , deleted_at
    );

CREATE INDEX IF NOT EXISTS
    idx_sale_student_id
    ON
    public.sales (
          student_id
        , deleted_at
    );

CREATE INDEX IF NOT EXISTS
    idx_user_id_active
    ON
    public.users (
          id
        , active
        , deleted_at
    );

CREATE INDEX IF NOT EXISTS
    idx_user_document
    ON
    public.users (
          document
        , deleted_at
    );

CREATE INDEX IF NOT EXISTS
    idx_user_email
    ON
    public.users (
          email
        , deleted_at
    );

CREATE INDEX IF NOT EXISTS
    idx_user_email_active
    ON
    public.users (
          email
        , active
    );

CREATE INDEX IF NOT EXISTS
    idx_user_email_token
    ON
    public.users (
          email
        , email_token
    );

CREATE INDEX IF NOT EXISTS
    idx_user_phone
    ON
    public.users (
          phone
        , deleted_at
    );