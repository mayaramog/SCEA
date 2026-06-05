-- RF07 - Suporte a Emendas de Protocolo
ALTER TABLE scea.protocolo 
ADD COLUMN protocolo_pai_id uuid;

ALTER TABLE scea.protocolo 
ADD CONSTRAINT fk_protocolo_pai 
FOREIGN KEY (protocolo_pai_id) 
REFERENCES scea.protocolo(id);

COMMENT ON COLUMN scea.protocolo.protocolo_pai_id IS 'Referência ao protocolo original (matriz) em caso de emenda (RN06).';
