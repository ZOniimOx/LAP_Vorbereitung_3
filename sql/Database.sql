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

insert into pc (modelname, cpu, ramcapacity, microphone, webcam, price, ssdcapacity)
values ('Home Basis', 'i3', '8 GB', true, true, 499, '500 GB'),
('Home Pro', 'i5', '8 GB', true, true, 599, '500 GB'),
('Home Chef', 'i7', '16 GB', true, true, 799, '500 GB')
;

select * from pc;
