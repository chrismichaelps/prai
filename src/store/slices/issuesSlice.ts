import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { castDraft } from 'immer';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Issue, IssueLabel, IssueComment as SchemaIssueComment } from '@/lib/effect/schemas/IssueSchema';

/** @Logic.Issues.State.Types */
/** @Logic.Issues.CommentType */
export type IssueComment = SchemaIssueComment;

/** @Logic.Issues.FilterType */
export interface IssueFilter {
  status?: string;
  label?: string;
  mine: boolean;
}

/** @Logic.Issues.StateType */
export interface IssuesState {
  issues: Issue[];
  total: number;
  page: number;
  filter: IssueFilter;
  listLoading: boolean;
  listError: string | null;
  showNewForm: boolean;
  currentIssue: Issue | null;
  comments: IssueComment[];
  detailLoading: boolean;
  detailError: string | null;
  upvoting: boolean;
  updatingStatus: boolean;
  submittingComment: boolean;
}

const initialState: IssuesState = {
  issues: [],
  total: 0,
  page: 1,
  filter: { mine: false },
  listLoading: false,
  listError: null,
  showNewForm: false,
  currentIssue: null,
  comments: [],
  detailLoading: false,
  detailError: null,
  upvoting: false,
  updatingStatus: false,
  submittingComment: false,
};

/** @Logic.Issues.State.Thunks */
/** @Logic.Issues.Thunk.FetchList */
export const fetchIssues = createAsyncThunk(
  'issues/fetchList',
  async ({ filter, page }: { filter: IssueFilter; page: number }, { rejectWithValue }) => {
    const params = new URLSearchParams();
    if (filter.status) params.set('status', filter.status);
    if (filter.label) params.set('label', filter.label);
    if (filter.mine) params.set('mine', 'true');
    params.set('page', String(page));
    const res = await fetch(`/api/issues?${params}`);
    if (!res.ok) return rejectWithValue('Failed to fetch issues');
    return res.json() as Promise<{ issues: Issue[]; total: number }>;
  }
);

/** @Logic.Issues.Thunk.FetchDetail */
export const fetchIssueDetail = createAsyncThunk(
  'issues/fetchDetail',
  async (id: string, { rejectWithValue }) => {
    const res = await fetch(`/api/issues/${id}`);
    if (!res.ok) return rejectWithValue('Issue not found');
    return res.json() as Promise<Issue>;
  }
);

/** @Logic.Issues.Thunk.Create */
export const createIssue = createAsyncThunk(
  'issues/create',
  async (
    payload: { title: string; body?: string; label?: IssueLabel },
    { rejectWithValue }
  ) => {
    const res = await fetch('/api/issues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const d = await res.json();
      return rejectWithValue(d.error ?? 'Failed to submit');
    }
    return res.json() as Promise<Issue>;
  }
);

/** @Logic.Issues.Thunk.ToggleUpvote */
export const toggleUpvote = createAsyncThunk(
  'issues/toggleUpvote',
  async (issueId: string, { dispatch, getState, rejectWithValue }) => {
    const state = getState() as { issues: IssuesState };
    const currentIssue = state.issues.currentIssue;
    const currentListIssue = state.issues.issues.find(i => i.id === issueId);
    const hasUpvoted = currentIssue?.id === issueId 
      ? Boolean(currentIssue.user_has_upvoted) 
      : Boolean(currentListIssue?.user_has_upvoted);
    
    dispatch(optimisticToggleUpvote({ issueId, hasUpvoted: !hasUpvoted }));
    
    const res = await fetch(`/api/issues/${issueId}/upvote`, { method: 'POST' });
    if (!res.ok) {
      dispatch(optimisticToggleUpvote({ issueId, hasUpvoted: hasUpvoted }));
      return rejectWithValue('Failed to toggle upvote');
    }
  }
);

/** @Logic.Issues.Thunk.UpdateStatus */
export const updateIssueStatus = createAsyncThunk(
  'issues/updateStatus',
  async (
    { issueId, status }: { issueId: string; status: string },
    { dispatch, rejectWithValue }
  ) => {
    const res = await fetch(`/api/issues/${issueId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) return rejectWithValue('Failed to update status');
    await dispatch(fetchIssueDetail(issueId));
  }
);

/** @Logic.Issues.Thunk.Delete */
export const deleteIssue = createAsyncThunk(
  'issues/delete',
  async (
    { issueId }: { issueId: string },
    { rejectWithValue }
  ) => {
    const res = await fetch(`/api/issues/${issueId}`, {
      method: 'DELETE',
    });
    if (!res.ok) return rejectWithValue('Failed to delete issue');
    return { issueId };
  }
);

/** @Logic.Issues.Thunk.AddComment */
export const addComment = createAsyncThunk(
  'issues/addComment',
  async (
    { issueId, body }: { issueId: string; body: string },
    { rejectWithValue }
  ) => {
    const res = await fetch(`/api/issues/${issueId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body }),
    });
    if (!res.ok) return rejectWithValue('Failed to post comment');
    return res.json() as Promise<IssueComment>;
  }
);

/** @Logic.Issues.Thunk.UpdateComment */
export const updateComment = createAsyncThunk(
  'issues/updateComment',
  async (
    { issueId, commentId, body }: { issueId: string; commentId: string; body: string },
    { rejectWithValue }
  ) => {
    const res = await fetch(`/api/issues/${issueId}/comments/${commentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body }),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to update comment' }))
      return rejectWithValue(error.error || 'Failed to update comment');
    }
    return res.json() as Promise<IssueComment>;
  }
);

/** @Logic.Issues.Thunk.DeleteComment - Soft delete */
export const deleteComment = createAsyncThunk(
  'issues/deleteComment',
  async (
    { issueId, commentId }: { issueId: string; commentId: string },
    { rejectWithValue }
  ) => {
    const res = await fetch(`/api/issues/${issueId}/comments/${commentId}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to delete comment' }))
      return rejectWithValue(error.error || 'Failed to delete comment');
    }
    return { commentId };
  }
);

/** @Logic.Issues.State.Slice */
/** @Logic.Issues.Slice */
export const issuesSlice = createSlice({
  name: 'issues',
  initialState,
  reducers: {
    /** @Logic.Issues.Action.SetFilter */
    setFilter: (state, action: PayloadAction<IssueFilter>) => {
      state.filter = action.payload;
      state.page = 1; // reset to page 1 on filter change
    },
    /** @Logic.Issues.Action.SetPage */
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    /** @Logic.Issues.Action.SetShowNewForm */
    setShowNewForm: (state, action: PayloadAction<boolean>) => {
      state.showNewForm = action.payload;
    },
    /** @Logic.Issues.Action.ClearDetail */
    clearDetail: (state) => {
      state.currentIssue = null;
      state.comments = [];
      state.detailLoading = false;
      state.detailError = null;
    },
/** @Logic.Issues.Action.ClearListError */
    clearListError: (state, _action: PayloadAction<string>) => {
      state.listError = null;
    },
    /** @Logic.Issues.Action.OptimisticUpvote */
    optimisticToggleUpvote: (state, action: PayloadAction<{ issueId: string; hasUpvoted: boolean }>) => {
      const { issueId, hasUpvoted } = action.payload;
      
      if (state.currentIssue && state.currentIssue.id === issueId) {
        state.currentIssue.user_has_upvoted = hasUpvoted;
        state.currentIssue.upvotes = hasUpvoted 
          ? state.currentIssue.upvotes + 1 
          : Math.max(0, state.currentIssue.upvotes - 1);
      }
      
      const issue = state.issues.find(i => i.id === issueId);
      if (issue) {
        issue.user_has_upvoted = hasUpvoted;
        issue.upvotes = hasUpvoted 
          ? issue.upvotes + 1 
          : Math.max(0, issue.upvotes - 1);
      }
},
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIssues.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchIssues.fulfilled, (state, action) => {
        state.listLoading = false;
        state.issues = castDraft(action.payload.issues);
        state.total = action.payload.total;
      })
      .addCase(fetchIssues.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload as string;
      });

    builder
      .addCase(fetchIssueDetail.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchIssueDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentIssue = castDraft(action.payload);
        state.comments = castDraft(action.payload.comments ?? []);
      })
      .addCase(fetchIssueDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload as string;
      });

    builder
      .addCase(createIssue.fulfilled, (state) => {
        state.showNewForm = false;
      });

    builder
      .addCase(toggleUpvote.pending, (state) => { state.upvoting = true; })
      .addCase(toggleUpvote.fulfilled, (state) => { state.upvoting = false; })
      .addCase(toggleUpvote.rejected, (state) => { state.upvoting = false; });

    builder
      .addCase(updateIssueStatus.pending, (state) => { state.updatingStatus = true; })
      .addCase(updateIssueStatus.fulfilled, (state) => { state.updatingStatus = false; })
      .addCase(updateIssueStatus.rejected, (state) => { state.updatingStatus = false; });

    builder
      .addCase(addComment.pending, (state) => { state.submittingComment = true; })
      .addCase(addComment.fulfilled, (state, action) => { 
        state.submittingComment = false;
        state.comments = [...state.comments, action.payload];
        if (state.currentIssue) {
          state.currentIssue.comments = [...(state.currentIssue.comments ?? []), action.payload];
        }
      })
      .addCase(addComment.rejected, (state) => { state.submittingComment = false; });

    builder
      .addCase(updateComment.fulfilled, (state, action) => {
        const idx = state.comments.findIndex(c => c.id === action.payload.id);
        if (idx !== -1) state.comments[idx] = action.payload;
        if (state.currentIssue?.comments) {
          const ci = state.currentIssue.comments.findIndex(c => c.id === action.payload.id);
          if (ci !== -1) state.currentIssue.comments[ci] = action.payload;
        }
      });

    builder
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(c => c.id !== action.payload.commentId);
        if (state.currentIssue?.comments) {
          state.currentIssue.comments = state.currentIssue.comments.filter(c => c.id !== action.payload.commentId);
        }
      });

    builder
      .addCase(deleteIssue.fulfilled, (state, action) => {
        state.issues = state.issues.filter((i) => i.id !== action.payload.issueId);
        state.total = Math.max(0, state.total - 1);
        if (state.currentIssue?.id === action.payload.issueId) {
          state.currentIssue = null;
        }
      });
  },
});

export const {
  setFilter,
  setPage,
  setShowNewForm,
  clearDetail,
  clearListError,
  optimisticToggleUpvote,
} = issuesSlice.actions;

export default issuesSlice.reducer;
