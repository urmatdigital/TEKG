import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LegacyClient } from '../auth/entities/legacy-client.entity';

@Injectable()
export class LegacyImportService {
  constructor(
    @InjectRepository(LegacyClient)
    private readonly legacyClientRepository: Repository<LegacyClient>
  ) {}

  async importLegacyClients(clients: Array<{
    clientCode: string;
    fullName: string;
    phone: string;
  }>) {
    const formattedClients = clients.map(client => ({
      client_code: client.clientCode,
      full_name: client.fullName,
      phone: this.formatPhoneNumber(client.phone),
    }));

    // Import in batches to avoid memory issues
    const batchSize = 100;
    for (let i = 0; i < formattedClients.length; i += batchSize) {
      const batch = formattedClients.slice(i, i + batchSize);
      await this.legacyClientRepository
        .createQueryBuilder()
        .insert()
        .into(LegacyClient)
        .values(batch)
        .orIgnore() // Skip duplicates
        .execute();
    }
  }

  private formatPhoneNumber(phone: string): string {
    // Remove any non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // If the number doesn't start with '+', add the country code
    if (!phone.startsWith('+')) {
      // Assuming Kyrgyzstan (+996) as default
      return `+996${digits}`;
    }
    
    return `+${digits}`;
  }
}
