drop database if
 exists lap_vorbereitung_3;

create database lap_vorbereitung_3;

use lap_vorbereitung_3;

create table pc (
	pcid int not null primary key auto_increment,
    modelname varchar(50) not null,
    cpu varchar(50) not null,
    ramcapacity varchar(20) not null,
    microphone bool,
    webcam bool,
    price decimal(10, 2) not null,
    ssdcapacity varchar(10) not null
);

insert into pcs (modelname, cpu, ramcapacity, microphone, webcam, price, ssdcapacity)
values ('Home Basis', 'i3', '8 GB', true, true, 499, '500 GB'),
('Home Pro', 'i5', '8 GB', true, true, 599, '500 GB'),
('Home Chef', 'i7', '16 GB', true, true, 799, '500 GB')
;

insert into additionalparts (partname, price) values ('RTX 2060 Grafikkarte', 89), ('1 TB SSD Erweiterung', 99);

insert into resellers (name, username, password) values ('Media Makrt', 'mmarkt', 'MediaMarkt'), ('Electronic4you', 'e4you', 'Electronic4U');

update orders set resellerid = 1 where orderid = 1;

select * from pcs;

select * from orders;

select * from additionalparts;


select * from resellers;

select * from users;

insert into users (username, password, resellerid) values ('mmakrt', 'MediaMakrt!', 1), ('e4you', 'Electronic4U!', 2);

insert into pcorders(pcid, orderid, quantity) values (1, 1, 10);


select * from pcorders;

delete from pcorders where pcorderid = 2;

select * from pcorderadditionalparts;

insert into pcorderadditionalparts (pcorderid, partid) values (1, 2);