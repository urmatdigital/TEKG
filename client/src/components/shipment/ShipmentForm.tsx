'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const shipmentSchema = z.object({
  senderName: z.string().min(2, 'Минимум 2 символа'),
  senderPhone: z.string().regex(/^\+996\d{9}$/, 'Формат: +996XXXXXXXXX'),
  senderAddress: z.string().min(5, 'Минимум 5 символов'),
  recipientName: z.string().min(2, 'Минимум 2 символа'),
  recipientPhone: z.string().regex(/^\+996\d{9}$/, 'Формат: +996XXXXXXXXX'),
  recipientAddress: z.string().min(5, 'Минимум 5 символов'),
  weight: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Введите корректный вес'),
  type: z.enum(['document', 'parcel', 'cargo']),
});

type ShipmentFormValues = z.infer<typeof shipmentSchema>;

interface ShipmentFormProps {
  onSubmit: (data: ShipmentFormValues) => void;
  isLoading?: boolean;
}

export function ShipmentForm({ onSubmit, isLoading = false }: ShipmentFormProps) {
  const form = useForm<ShipmentFormValues>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      senderName: '',
      senderPhone: '',
      senderAddress: '',
      recipientName: '',
      recipientPhone: '',
      recipientAddress: '',
      weight: '',
      type: 'parcel',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Информация об отправителе</h3>
          <FormField
            control={form.control}
            name="senderName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ФИО отправителя</FormLabel>
                <FormControl>
                  <Input placeholder="Иван Иванов" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="senderPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Телефон отправителя</FormLabel>
                <FormControl>
                  <Input placeholder="+996XXXXXXXXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="senderAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Адрес отправителя</FormLabel>
                <FormControl>
                  <Input placeholder="Улица, дом, квартира" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Информация о получателе</h3>
          <FormField
            control={form.control}
            name="recipientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ФИО получателя</FormLabel>
                <FormControl>
                  <Input placeholder="Петр Петров" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="recipientPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Телефон получателя</FormLabel>
                <FormControl>
                  <Input placeholder="+996XXXXXXXXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="recipientAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Адрес получателя</FormLabel>
                <FormControl>
                  <Input placeholder="Улица, дом, квартира" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Информация об отправлении</h3>
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Вес (кг)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Тип отправления</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип отправления" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="document">Документы</SelectItem>
                    <SelectItem value="parcel">Посылка</SelectItem>
                    <SelectItem value="cargo">Груз</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Создание...' : 'Создать отправление'}
        </Button>
      </form>
    </Form>
  );
}
