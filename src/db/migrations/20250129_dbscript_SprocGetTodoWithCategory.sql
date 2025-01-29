
CREATE PROCEDURE SprocGetTodoWithCategory()
BEGIN
    SELECT ct.title, ct.description
    FROM todo td
    JOIN category ct ON td.categoryId = ct.id;
END;
