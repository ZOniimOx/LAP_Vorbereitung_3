use lap_vorbereitung_3;

select p.modelname, count(po.pcid) as 'order count'
from pcorders po
join pcs p on po.pcid = p.pcid
group by p.modelname
order by count(po.pcid) desc
limit 1;

select 
p.modelname, p.price, (sum(po.quantity) * p.price) + ap.total 'total sales'
#,  sum(ap.total) 
from pcs p
join pcorders po on p.pcid = po.pcid
 join (
	select po.pcid, sum(price) 'total'
	from
	pcorderadditionalparts apo 
	join additionalparts ap on apo.partid = ap.partid
	join pcorders po on apo.pcorderid = po.pcorderid
	group by po.pcid
) ap on p.pcid = ap.pcid
group by p.pcid
order by p.pcid;

select count(pcorderid) 'count orders'
from pcorders po 
join pcs p on po.pcid = p.pcid
where po.quantity > 3;
