import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockParcels } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';

const statusMap = {
  in_transit: { label: 'В пути', color: 'bg-yellow-500' },
  delivered: { label: 'Доставлено', color: 'bg-green-500' },
  pending: { label: 'Ожидает', color: 'bg-blue-500' },
};

export function ParcelList() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Трек номер</TableHead>
            <TableHead>Описание</TableHead>
            <TableHead>Вес (кг)</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Дата создания</TableHead>
            <TableHead>Ожидаемая доставка</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockParcels.map((parcel) => (
            <TableRow key={parcel.id}>
              <TableCell className="font-medium">{parcel.tracking_number}</TableCell>
              <TableCell>{parcel.description}</TableCell>
              <TableCell>{parcel.weight}</TableCell>
              <TableCell>
                <Badge 
                  className={statusMap[parcel.status as keyof typeof statusMap]?.color}
                >
                  {statusMap[parcel.status as keyof typeof statusMap]?.label}
                </Badge>
              </TableCell>
              <TableCell>{new Date(parcel.created_at).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(parcel.estimated_delivery).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
