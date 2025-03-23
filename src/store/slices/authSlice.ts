import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from "firebase/auth";
import { createUserDocument, getUserDocument } from "@/lib/firestore";

export interface UserData {
  email: string;
  displayName: string;
  createdAt: string;
  lastLogin: string;
}

// state interface
interface AuthState {
  currentUser: User | null;
  userData: UserData | null;
  userLoggedIn: boolean;
  loading: boolean;
  error: string | null;
}

// initial state
const initialState: AuthState = {
  currentUser: null,
  userData: null,
  userLoggedIn: false,
  loading: false,
  error: null,
};

/*-- Async Thunks --*/

// email/password sign in
export const signInAsync = createAsyncThunk(
  "auth/signIn",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const userCreds = await signInWithEmailAndPassword(auth, email, password);
      const userData = (await getUserDocument(userCreds.user.uid)) as UserData;
      return { user: userCreds.user, userData };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

// google sign in
export const signInWithGoogleAsync = createAsyncThunk(
  "auth/signInWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      const provider = new GoogleAuthProvider();
      const userCreds = await signInWithPopup(auth, provider);
      const now = new Date().toISOString();

      // create/update user document
      const userData: UserData = {
        email: userCreds.user.email!,
        displayName:
          userCreds.user.displayName || userCreds.user.email!.split("@")[0],
        createdAt: now,
        lastLogin: now,
      };

      await createUserDocument(userCreds.user.uid, userData);

      return {
        user: userCreds.user,
        userData,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

// sign up
export const signUpAsync = createAsyncThunk(
  "auth/signUp",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const now = new Date().toISOString();

      const userData: UserData = {
        email,
        displayName: email.split("@")[0],
        createdAt: now,
        lastLogin: now,
      };

      // store in firestore
      await createUserDocument(userCredential.user.uid, userData);

      return {
        user: userCredential.user,
        userData,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

// sign out
export const signOutAsync = createAsyncThunk(
  "auth/signOut",
  async (_, { rejectWithValue }) => {
    try {
      await firebaseSignOut(auth);
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

// fetch user data
export const fetchUserDataAsync = createAsyncThunk(
  "auth/fetchUserData",
  async (userId: string, { rejectWithValue }) => {
    try {
      const userData = (await getUserDocument(userId)) as UserData;
      return userData;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

/*-- Auth Slice --*/
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
      state.userLoggedIn = !action.payload;
    },
    setUserData: (state, action: PayloadAction<UserData | null>) => {
      state.userData = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // sign in
      .addCase(signInAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInAsync.fulfilled, (state, action) => {
        state.currentUser = action.payload.user;
        state.userData = action.payload.userData;
        state.userLoggedIn = true;
        state.loading = false;
      })
      .addCase(signInAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // google sign in
      .addCase(signInWithGoogleAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithGoogleAsync.fulfilled, (state, action) => {
        state.currentUser = action.payload.user;
        state.userData = action.payload.userData;
        state.userLoggedIn = true;
        state.loading = false;
      })
      .addCase(signInWithGoogleAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signUpAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpAsync.fulfilled, (state, action) => {
        state.currentUser = action.payload.user;
        state.userData = action.payload.userData;
        state.userLoggedIn = true;
        state.loading = false;
      })
      .addCase(signUpAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signOutAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signOutAsync.fulfilled, (state) => {
        state.currentUser = null;
        state.userData = null;
        state.userLoggedIn = false;
        state.loading = false;
      })
      .addCase(signOutAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserDataAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserDataAsync.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserDataAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, setUserData, setLoading, clearError } =
  authSlice.actions;

export default authSlice.reducer;
