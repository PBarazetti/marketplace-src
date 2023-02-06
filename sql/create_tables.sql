CREATE TABLE IF NOT EXISTS products (
  id serial4 NOT NULL,
  "name" varchar NOT NULL,
  description varchar NOT NULL,
  price float8 NOT NULL DEFAULT '0'::double precision,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS stock (
  product_id int4 NOT NULL,
  quantity int4 NOT NULL DEFAULT 0,
  PRIMARY KEY (product_id)
);
