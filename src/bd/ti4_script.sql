CREATE TABLE `Funcionario` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `usuario` varchar(255) UNIQUE NOT NULL,
  `senha` varchar(255) NOT NULL,
  `tipo` enum('GESTOR','VENDEDOR','ESTOQUISTA','ADMINISTRADOR') NOT NULL,
  `ativo` bool NOT NULL DEFAULT true
);

CREATE TABLE `Venda` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `id_cliente` int NOT NULL,
  `id_vendedor` int NOT NULL,
  `valor_total` decimal(10,2) NOT NULL,
  `data` datetime,
  `sincronizado` bool DEFAULT false
);

CREATE TABLE `Cliente` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `cnpj` varchar(14) UNIQUE NOT NULL,
  `email` varchar(150) NOT NULL,
  `telefone` varchar(11) NOT NULL,
  `criado_em` date NOT NULL
);

CREATE TABLE `Meta_Mensal` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `mes` int NOT NULL,
  `ano` int NOT NULL,
  `valor_meta` decimal(10,2) NOT NULL,
  `criado_por` int
);

CREATE TABLE `Venda_Produto` (
  `id_venda` int,
  `id_produto` int,
  `quantidade` int NOT NULL,
  `preco_unitario` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_venda`, `id_produto`)
);

CREATE TABLE `Produto` (
  `id_item` int PRIMARY KEY,
  `preco_venda` decimal(10,2) NOT NULL
);

CREATE TABLE `Insumo` (
  `id_item` int PRIMARY KEY,
  `fornecedor` varchar(100) NOT NULL
);

CREATE TABLE `Item` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `unidade` enum('POTE','PACOTE','CAIXA','KG','LITRO','GRAMAS') NOT NULL,
  `quantidade` int NOT NULL,
  `validade` date NOT NULL
);

ALTER TABLE `Venda` ADD FOREIGN KEY (`id_cliente`) REFERENCES `Cliente` (`id`);

ALTER TABLE `Venda` ADD FOREIGN KEY (`id_vendedor`) REFERENCES `Funcionario` (`id`);

ALTER TABLE `Meta_Mensal` ADD FOREIGN KEY (`criado_por`) REFERENCES `Funcionario` (`id`);

ALTER TABLE `Venda_Produto` ADD FOREIGN KEY (`id_venda`) REFERENCES `Venda` (`id`);

ALTER TABLE `Venda_Produto` ADD FOREIGN KEY (`id_produto`) REFERENCES `Produto` (`id_item`);

ALTER TABLE `Insumo` ADD FOREIGN KEY (`id_item`) REFERENCES `Item` (`id`);

ALTER TABLE `Produto` ADD FOREIGN KEY (`id_item`) REFERENCES `Item` (`id`);
