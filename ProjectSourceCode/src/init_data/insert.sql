
-------------100's-----------------

INSERT INTO seats (row, section, seat_number) VALUES
SELECT
    rows.row,
    sections.section,
    ARRAY[]::INT[]
FROM
    generate_series(1,41) AS rows(row),
    generate_series(100,135) AS sections(section)
    returning * ;

INSERT INTO seats (row, section, seat_number) VALUES
SELECT
    rows.row,
    sections.section,
    ARRAY[]::INT[]
FROM
    generate_series(1,41) AS rows(row),
    generate_series(130,134) AS sections(section)
    returning * ;

INSERT INTO seats (row, section, seat_number) VALUES
SELECT
    rows.row,
    sections.section,
    ARRAY[]::INT[]
FROM
    generate_series(1,43) AS rows(row),
    (VALUES (129), (135)) AS sections(section)
    returning * ;

------------------200's---------------

INSERT INTO seats (row, section, seat_number) VALUES
SELECT
    rows.row,
    sections.section,
    ARRAY[]::INT[]
FROM
    generate_series(1,33) AS rows(row),
    (VALUES (229), (230), (234), (235), (236)) AS sections(section)
    returning * ;

INSERT INTO seats (row, section, seat_number) VALUES
SELECT
    rows.row,
    sections.section,
    ARRAY[]::INT[]
FROM
    generate_series(1,20) AS rows(row),
    (VALUES (231), (232), (233)) AS sections(section)
    returning * ;


-------------300's-------------

INSERT INTO seats (row, section, seat_number) VALUES
SELECT
    rows.row,
    sections.section,
    ARRAY[]::INT[]
FROM
    generate_series(1,19) AS rows(row),
    generate_series(300,346) AS sections(section)
    returning * ;

INSERT INTO seats (row, section, seat_number) VALUES
SELECT
    rows.row,
    sections.section,
    ARRAY[]::INT[]
FROM
    generate_series(1,19) AS rows(row),
    generate_series(300,346) AS sections(section)
    returning * ;

---------------500's-----------------

INSERT INTO seats (row, section, seat_number) VALUES
SELECT
    rows.row,
    sections.section,
    ARRAY[]::INT[]
FROM
    generate_series(1,23) AS rows(row),
    (VALUES (500), (501), (515), (516), (526), (527), (528), (541), (542)) AS sections(section)
    returning * ;

INSERT INTO seats (row, section, seat_number) VALUES
SELECT
    rows.row,
    sections.section,
    ARRAY[]::INT[]
FROM
    generate_series(1,24) AS rows(row),
    (VALUES (514), (540)) AS sections(section)
    returning * ;

INSERT INTO seats (row, section, seat_number) VALUES
SELECT
    rows.row,
    sections.section,
    ARRAY[]::INT[]
FROM
    generate_series(1,25) AS rows(row),
    (VALUES (502), (517), (525)) AS sections(section)
    returning * ;

INSERT INTO seats (row, section, seat_number) VALUES
SELECT
    rows.row,
    sections.section,
    ARRAY[]::INT[]
FROM
    generate_series(1,28) AS rows(row),
    (VALUES (503), (513), (518), (524), (529), (539)) AS sections(section)
    returning * ;

INSERT INTO seats (row, section, seat_number) VALUES
SELECT
    rows.row,
    sections.section,
    ARRAY[]::INT[]
FROM
    generate_series(1,31) AS rows(row),
    (VALUES (512), (538)) AS sections(section)
    returning * ;

INSERT INTO seats (row, section, seat_number) VALUES
SELECT
    rows.row,
    sections.section,
    ARRAY[]::INT[]
FROM
    generate_series(1,32) AS rows(row),
    (VALUES (504), (519), (523), (530)) AS sections(section)
    returning * ;

INSERT INTO seats (row, section, seat_number) VALUES
SELECT
    rows.row,
    sections.section,
    ARRAY[]::INT[]
FROM
    generate_series(1,33) AS rows(row),
    (VALUES (508), (511), (520), (521), (522), (537)) AS sections(section)
    returning * ;

INSERT INTO seats (row, section, seat_number) VALUES
SELECT
    rows.row,
    sections.section,
    ARRAY[]::INT[]
FROM
    generate_series(1,34) AS rows(row),
    (VALUES (505), (531)) AS sections(section)
    returning * ;

INSERT INTO seats (row, section, seat_number) VALUES
SELECT
    rows.row,
    sections.section,
    ARRAY[]::INT[]
FROM
    generate_series(1,35) AS rows(row),
    (VALUES (506), (510), (532), (536)) AS sections(section)
    returning * ;

INSERT INTO seats (row, section, seat_number) VALUES
SELECT
    rows.row,
    sections.section,
    ARRAY[]::INT[]
FROM
    generate_series(1,36) AS rows(row),
    (VALUES (507), (509), (533), (534), (535)) AS sections(section)
    returning * ;