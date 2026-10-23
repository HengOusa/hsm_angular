import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Bed, BedStatus, WardSummary } from '../domain/bed.entity';
import { BedActions } from './bed.actions';

export interface BedsState extends EntityState<Bed> {
  wards: WardSummary[];
  loading: boolean;
  error: string | null;
  wardFilter: string;
  statusFilter: BedStatus | 'ALL';
}

export const bedAdapter = createEntityAdapter<Bed>({ selectId: (b) => b.id });

export const initialBedsState: BedsState = bedAdapter.getInitialState({
  wards: [],
  loading: false,
  error: null,
  wardFilter: 'ALL',
  statusFilter: 'ALL',
});

export const bedsReducer = createReducer(
  initialBedsState,

  on(BedActions.load, (state) => ({ ...state, loading: true, error: null })),

  on(BedActions.loadSuccess, (state, { beds, wards }) =>
    bedAdapter.setAll(beds, { ...state, loading: false, wards })
  ),

  on(BedActions.loadFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(BedActions.setWardFilter, (state, { wardId }) => ({
    ...state,
    wardFilter: wardId,
  })),

  on(BedActions.setStatusFilter, (state, { status }) => ({
    ...state,
    statusFilter: status,
  })),

  on(BedActions.updateStatusSuccess, (state, { bed }) =>
    bedAdapter.upsertOne(bed, state)
  ),

  on(BedActions.clearError, (state) => ({ ...state, error: null }))
);
