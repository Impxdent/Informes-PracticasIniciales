CREATE TABLE Usuario (
    id_usuario VARCHAR2(10) NOT NULL,
    registro_academico VARCHAR2(10),
    nombre VARCHAR2(25),
    apellido VARCHAR2(25),
    correo VARCHAR2(50),
    contraseña VARCHAR2(20),
    CONSTRAINT Usuario_PK PRIMARY KEY (id_usuario)
);

CREATE TABLE Catedratico (
    id_catedratico VARCHAR2(10) NOT NULL,
    nombre VARCHAR2(25),
    apellido VARCHAR2(25),
    correo VARCHAR2(25),
    CONSTRAINT Catedratico_PK PRIMARY KEY (id_catedratico)
);

CREATE TABLE Curso (
    id_curso VARCHAR2(10) NOT NULL,
    nombre_curso VARCHAR2(25),
    creditos VARCHAR2(5),
    area VARCHAR2(25),
    CONSTRAINT Curso_PK PRIMARY KEY (id_curso)
);

CREATE TABLE Publicacion (
    id_publicacion VARCHAR2(10) NOT NULL,
    id_usuario VARCHAR2(10),
    id_curso VARCHAR2(10),
    id_catedr VARCHAR2(10),
    mensaje VARCHAR2(50),
    fecha DATE,
    CONSTRAINT Publicacion_PK PRIMARY KEY (id_publicacion)
);

CREATE TABLE Comentario (
    id_comentario VARCHAR2(10) NOT NULL,
    id_publicacion VARCHAR2(10),
    id_usuario VARCHAR2(10),
    mensaje VARCHAR2(50),
    fecha DATE,
    CONSTRAINT Comentario_PK PRIMARY KEY (id_comentario)
);

-- Tabla pivote N:N
CREATE TABLE curso_aprobado (
    id_registro VARCHAR2(10) NOT NULL,
    id_usuario VARCHAR2(10),
    id_curso VARCHAR2(10),
    fecha_aprobacion DATE,
    CONSTRAINT curso_aprobado_PK PRIMARY KEY (id_registro)
);

-- Relaciones

ALTER TABLE Publicacion
ADD CONSTRAINT Publicacion_Usuario_FK
FOREIGN KEY (id_usuario)
REFERENCES Usuario(id_usuario);

ALTER TABLE Publicacion
ADD CONSTRAINT Publicacion_Curso_FK
FOREIGN KEY (id_curso)
REFERENCES Curso(id_curso);

ALTER TABLE Publicacion
ADD CONSTRAINT Publicacion_Catedratico_FK
FOREIGN KEY (id_catedr)
REFERENCES Catedratico(id_catedratico);

ALTER TABLE Comentario
ADD CONSTRAINT Comentario_Publicacion_FK
FOREIGN KEY (id_publicacion)
REFERENCES Publicacion(id_publicacion);

ALTER TABLE Comentario
ADD CONSTRAINT Comentario_Usuario_FK
FOREIGN KEY (id_usuario)
REFERENCES Usuario(id_usuario);

ALTER TABLE curso_aprobado
ADD CONSTRAINT curso_aprobado_usuario_FK
FOREIGN KEY (id_usuario)
REFERENCES Usuario(id_usuario);

ALTER TABLE curso_aprobado
ADD CONSTRAINT curso_aprobado_curso_FK
FOREIGN KEY (id_curso)
REFERENCES Curso(id_curso);