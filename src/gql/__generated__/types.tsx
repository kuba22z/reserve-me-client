export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export const enum CognitoGroupDto {
  Admin = 'admin',
  Client = 'client',
  Employee = 'employee'
};

/** Counter */
export type CounterDto = {
  readonly __typename?: 'CounterDto';
  readonly count: Scalars['Float']['output'];
};

/** CreateLocationDto */
export type CreateLocationDto = {
  readonly city: Scalars['String']['input'];
  readonly houseNumber: Scalars['Float']['input'];
  readonly name: Scalars['String']['input'];
  readonly postalCode: Scalars['String']['input'];
  readonly street: Scalars['String']['input'];
};

export type CreateMeetingDto = {
  readonly createdByExternalRefId: Scalars['String']['input'];
  readonly discount?: InputMaybe<Scalars['Float']['input']>;
  readonly notes: Scalars['String']['input'];
  readonly priceExcepted: Scalars['Float']['input'];
  readonly priceFinal?: InputMaybe<Scalars['Float']['input']>;
  readonly priceFull?: InputMaybe<Scalars['Float']['input']>;
  readonly repeatRate?: InputMaybe<Scalars['String']['input']>;
  readonly schedule: CreateMeetingScheduleDto;
  readonly userNames: ReadonlyArray<Scalars['String']['input']>;
};

/** CreateMeetingSchedule */
export type CreateMeetingScheduleDto = {
  readonly endDate: Scalars['DateTime']['input'];
  readonly locationId: Scalars['Float']['input'];
  readonly startDate: Scalars['DateTime']['input'];
};

export type CreateUserDto = {
  readonly groups?: InputMaybe<ReadonlyArray<CognitoGroupDto>>;
  readonly name: Scalars['String']['input'];
  readonly phoneNumber: Scalars['String']['input'];
  readonly userName: Scalars['String']['input'];
};

export const enum GrantTypeDto {
  AuthorizationCode = 'authorization_code',
  RefreshToken = 'refresh_token'
};

/** LocationDto */
export type LocationDto = {
  readonly __typename?: 'LocationDto';
  readonly city: Scalars['String']['output'];
  readonly houseNumber: Scalars['Float']['output'];
  readonly id: Scalars['Float']['output'];
  readonly name: Scalars['String']['output'];
  readonly postalCode: Scalars['String']['output'];
  readonly street: Scalars['String']['output'];
};

/** Meeting */
export type MeetingDto = {
  readonly __typename?: 'MeetingDto';
  readonly createdAt?: Maybe<Scalars['DateTime']['output']>;
  readonly createdByExternalRefId?: Maybe<Scalars['String']['output']>;
  readonly discount?: Maybe<Scalars['Float']['output']>;
  readonly id: Scalars['Float']['output'];
  readonly notes?: Maybe<Scalars['String']['output']>;
  readonly priceExcepted?: Maybe<Scalars['Float']['output']>;
  readonly priceFinal?: Maybe<Scalars['Float']['output']>;
  readonly priceFull?: Maybe<Scalars['Float']['output']>;
  readonly repeatRate?: Maybe<Scalars['String']['output']>;
  readonly schedules?: Maybe<ReadonlyArray<MeetingScheduleDto>>;
  readonly updatedAt?: Maybe<Scalars['DateTime']['output']>;
  readonly userNames?: Maybe<ReadonlyArray<Scalars['String']['output']>>;
};

/** MeetingSchedule */
export type MeetingScheduleDto = {
  readonly __typename?: 'MeetingScheduleDto';
  readonly canceled: Scalars['Boolean']['output'];
  readonly cancellationReason?: Maybe<Scalars['String']['output']>;
  readonly endDate: Scalars['DateTime']['output'];
  readonly id: Scalars['Float']['output'];
  readonly location: LocationDto;
  readonly locationId: Scalars['Float']['output'];
  readonly startDate: Scalars['DateTime']['output'];
};

export type Mutation = {
  readonly __typename?: 'Mutation';
  readonly createLocation: LocationDto;
  readonly createMeeting: MeetingDto;
  readonly createUser: UserDto;
  readonly deleteMeetings: CounterDto;
  readonly updateLocation: LocationDto;
  readonly updateMeeting: MeetingDto;
};


export type MutationCreateLocationArgs = {
  location: CreateLocationDto;
};


export type MutationCreateMeetingArgs = {
  meeting: CreateMeetingDto;
};


export type MutationCreateUserArgs = {
  user: CreateUserDto;
};


export type MutationDeleteMeetingsArgs = {
  ids: ReadonlyArray<Scalars['Int']['input']>;
};


export type MutationUpdateLocationArgs = {
  location: UpdateLocationDto;
};


export type MutationUpdateMeetingArgs = {
  meeting: UpdateMeetingDto;
};

export type Query = {
  readonly __typename?: 'Query';
  readonly accessToken: TokenDto;
  readonly locations: ReadonlyArray<LocationDto>;
  readonly login: Scalars['String']['output'];
  readonly logout: Scalars['Float']['output'];
  readonly meetings: ReadonlyArray<MeetingDto>;
  readonly meetingsByInterval: ReadonlyArray<MeetingDto>;
  readonly reservedMeetings: ReadonlyArray<MeetingDto>;
  readonly user: UserWithGroupDto;
  readonly users: ReadonlyArray<UserDto>;
  readonly usersByGroup: ReadonlyArray<UserDto>;
};


export type QueryAccessTokenArgs = {
  tokenRequest: TokenRequestDto;
};


export type QueryMeetingsByIntervalArgs = {
  canceled?: InputMaybe<Scalars['Boolean']['input']>;
  from: Scalars['DateTime']['input'];
  to: Scalars['DateTime']['input'];
};


export type QueryUsersByGroupArgs = {
  group?: InputMaybe<CognitoGroupDto>;
};

/** TokenDto */
export type TokenDto = {
  readonly __typename?: 'TokenDto';
  readonly accessToken: Scalars['String']['output'];
  readonly expiresIn: Scalars['Float']['output'];
  readonly groups: ReadonlyArray<CognitoGroupDto>;
  readonly idToken: Scalars['String']['output'];
  readonly refreshToken?: Maybe<Scalars['String']['output']>;
  readonly tokenType: Scalars['String']['output'];
};

/** TokenRequestDto */
export type TokenRequestDto = {
  readonly authorizationCode?: InputMaybe<Scalars['String']['input']>;
  readonly grantType: GrantTypeDto;
  readonly refreshToken?: InputMaybe<Scalars['String']['input']>;
};

/** UpdateLocationDto */
export type UpdateLocationDto = {
  readonly city?: InputMaybe<Scalars['String']['input']>;
  readonly houseNumber?: InputMaybe<Scalars['Float']['input']>;
  readonly id: Scalars['Float']['input'];
  readonly name?: InputMaybe<Scalars['String']['input']>;
  readonly postalCode?: InputMaybe<Scalars['String']['input']>;
  readonly street?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMeetingDto = {
  readonly discount?: InputMaybe<Scalars['Float']['input']>;
  readonly id: Scalars['Float']['input'];
  readonly locationId?: InputMaybe<Scalars['Float']['input']>;
  readonly notes?: InputMaybe<Scalars['String']['input']>;
  readonly priceExcepted?: InputMaybe<Scalars['Float']['input']>;
  readonly priceFinal?: InputMaybe<Scalars['Float']['input']>;
  readonly priceFull?: InputMaybe<Scalars['Float']['input']>;
  readonly repeatRate?: InputMaybe<Scalars['String']['input']>;
  readonly schedules?: InputMaybe<ReadonlyArray<UpdateMeetingScheduleDto>>;
  readonly userNames?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
};

/** UpdateMeetingSchedule */
export type UpdateMeetingScheduleDto = {
  readonly canceled?: InputMaybe<Scalars['Boolean']['input']>;
  readonly cancellationReason?: InputMaybe<Scalars['String']['input']>;
  readonly endDate?: InputMaybe<Scalars['DateTime']['input']>;
  readonly id: Scalars['Float']['input'];
  readonly startDate?: InputMaybe<Scalars['DateTime']['input']>;
};

/** UserDtoWithoutGroupsDto */
export type UserDto = {
  readonly __typename?: 'UserDto';
  readonly id: Scalars['String']['output'];
  readonly meetings?: Maybe<ReadonlyArray<MeetingDto>>;
  readonly name: Scalars['String']['output'];
  readonly phoneNumber: Scalars['String']['output'];
  readonly userName: Scalars['String']['output'];
};

/** UserDto */
export type UserWithGroupDto = {
  readonly __typename?: 'UserWithGroupDto';
  readonly groups: ReadonlyArray<CognitoGroupDto>;
  readonly id: Scalars['String']['output'];
  readonly meetings?: Maybe<ReadonlyArray<MeetingDto>>;
  readonly name: Scalars['String']['output'];
  readonly phoneNumber: Scalars['String']['output'];
  readonly userName: Scalars['String']['output'];
};
