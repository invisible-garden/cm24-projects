-- db-setup/create_wallet_field.sql

INSERT INTO mdl_user_info_field (shortname, name, datatype, categoryid, description, descriptionformat, required, locked, visible, forceunique, signup, defaultdata, defaultdataformat, param1, param2, param3)
VALUES ('wallet', 'Ethereum Wallet', 'text', 1, 'User Ethereum wallet address', 1, 0, 0, 1, 0, 0, '', 1, 42, '', '');