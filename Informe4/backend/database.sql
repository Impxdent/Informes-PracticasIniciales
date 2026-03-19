CREATE TABLE Usuario (
    id_usuario VARCHAR(10) NOT NULL,
    registro_academico VARCHAR(10),
    nombre VARCHAR(25),
    apellido VARCHAR(25),
    correo VARCHAR(50),
    contraseña VARCHAR(20),
    PRIMARY KEY (id_usuario)
);

CREATE TABLE Catedratico (
    id_catedratico VARCHAR(10) NOT NULL,
    nombre VARCHAR(25),
    apellido VARCHAR(25),
    correo VARCHAR(25),
    PRIMARY KEY (id_catedratico)
);

CREATE TABLE Curso (
    id_curso VARCHAR(10) NOT NULL,
    nombre_curso VARCHAR(25),
    creditos VARCHAR(5),
    area VARCHAR(25),
    PRIMARY KEY (id_curso)
);

CREATE TABLE Publicacion (
    id_publicacion VARCHAR(10) NOT NULL,
    id_usuario VARCHAR(10),
    id_curso VARCHAR(10),
    id_catedr VARCHAR(10),
    mensaje VARCHAR(50),
    fecha DATETIME,
    PRIMARY KEY (id_publicacion)
);

CREATE TABLE Comentario (
    id_comentario VARCHAR(10) NOT NULL,
    id_publicacion VARCHAR(10),
    id_usuario VARCHAR(10),
    mensaje VARCHAR(50),
    fecha DATETIME,
    PRIMARY KEY (id_comentario)
);

CREATE TABLE curso_aprobado (
    id_registro VARCHAR(10) NOT NULL,
    id_usuario VARCHAR(10),
    id_curso VARCHAR(10),
    fecha_aprobacion DATETIME,
    PRIMARY KEY (id_registro)
);

-- FOREIGN KEYS

ALTER TABLE Publicacion
ADD FOREIGN KEY (id_usuario)
REFERENCES Usuario(id_usuario);

ALTER TABLE Publicacion
ADD FOREIGN KEY (id_curso)
REFERENCES Curso(id_curso);

ALTER TABLE Publicacion
ADD FOREIGN KEY (id_catedr)
REFERENCES Catedratico(id_catedratico);

ALTER TABLE Comentario
ADD FOREIGN KEY (id_publicacion)
REFERENCES Publicacion(id_publicacion);

ALTER TABLE Comentario
ADD FOREIGN KEY (id_usuario)
REFERENCES Usuario(id_usuario);

ALTER TABLE curso_aprobado
ADD FOREIGN KEY (id_usuario)
REFERENCES Usuario(id_usuario);

ALTER TABLE curso_aprobado
ADD FOREIGN KEY (id_curso)
REFERENCES Curso(id_curso);