'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import { Profile, AdminDashboardData } from '@/types/dashboard';
import { DeleteAccountModal } from '@/components/dashboard/DeleteAccountModal';
import { ReferralsList } from '@/components/dashboard/ReferralsList';
import { TransactionsList } from '@/components/dashboard/TransactionsList';
import { LoadingState } from '@/components/dashboard/LoadingState';
import { useDashboardData } from '@/hooks/useDashboardData';

// ... остальной код остается тем же