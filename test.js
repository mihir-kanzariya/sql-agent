const axios = require('axios');

const HOST = 'http://localhost:8000'; // Replace with your API host

let arr = [
`TableName: Account,
Properties: BillingLongitude, BillingLatitude, AnnualRevenue, NumberOfEmployees, Description, CreatedDate, LastModifiedDate, SystemModstamp, LastActivityDate, LastViewedDate, LastReferencedDate, Jigsaw, JigsawCompanyId, AccountSource, SicDesc, Account_Mock_Data__c, RevenuePotential__c, rules_applied, confidence_score, bookmark`,
`TableName: Account,
Properties: Id, IsDeleted, Name, Type, BillingStreet, BillingCity, BillingState, BillingPostalCode, Industry, BillingCountry, LastModifiedById, CreatedById, OwnerId, ParentId, MasterRecordId, PhotoUrl, Website, Phone, ShippingAddress, ShippingGeocodeAccuracy    `,
`TableName: Account,
Properties: ShippingLongitude, ShippingLatitude, ShippingCountry, ShippingPostalCode, ShippingState, ShippingCity, ShippingStreet, BillingAddress, BillingGeocodeAccuracy`,
`TableName: BusinessHours,
Properties: CreatedById, LastModifiedById, bookmark, confidence_score, rules_applied, LastViewedDate, LastModifiedDate, CreatedDate, SystemModstamp, TimeZoneSidKey, SaturdayEndTime, SaturdayStartTime, FridayEndTime, FridayStartTime, ThursdayEndTime, ThursdayStartTime, WednesdayEndTime, WednesdayStartTime, TuesdayEndTime, TuesdayStartTime`,
`TableName: BusinessHours,
Properties: MondayEndTime, MondayStartTime, SundayEndTime, SundayStartTime, IsDefault, IsActive, Name, Id`,
`TableName: Calendar,
Properties: bookmark, confidence_score, CreatedById, LastModifiedById, rules_applied, SystemModstamp, LastModifiedDate, CreatedDate, IsActive, Type, Name, Id, UserId`,
`TableName: Campaign,
Properties: Name, Id, LastModifiedById, CreatedById, OwnerId, ParentId, bookmark, confidence_score, rules_applied, LastReferencedDate, LastViewedDate, LastActivityDate, SystemModstamp, LastModifiedDate, CreatedDate, AmountWonOpportunities, AmountAllOpportunities, NumberOfWonOpportunities, NumberOfOpportunities, NumberOfResponses`,
`TableName: Campaign,
Properties: NumberOfContacts, NumberOfConvertedLeads, NumberOfLeads, Description, IsActive, NumberSent, ExpectedResponse, ActualCost, BudgetedCost, ExpectedRevenue, EndDate, StartDate, Status, Type, IsDeleted`,
`TableName: Case,
Properties: Status, Type, SuppliedCompany, SuppliedPhone, SuppliedEmail, SuppliedName, CaseNumber, rules_applied, IsDeleted, Id, confidence_score, bookmark, MasterRecordId, LastModifiedById, CreatedById, OwnerId, ParentId, AccountId, ContactId, LastReferencedDate`,
`TableName: Case,
Properties: LastViewedDate, Comments, ContactFax, ContactEmail, ContactMobile, ContactPhone, SystemModstamp, LastModifiedDate, CreatedDate, IsEscalated, ClosedDate, IsClosed, Description, Priority, Subject, Origin, Reason`,
`TableName: Contact,
Properties: Phone, MobilePhone, Email, Title, Department, CreatedDate, LastModifiedDate, SystemModstamp, LastActivityDate, LastCURequestDate, LastCUupdatedAte, LastViewedDate, LastReferencedDate, EmailBouncedReason, EmailBouncedDate, FirstName, IsEmailBounced, PhotoUrl, Jigsaw, JigsawContactId`,
`TableName: Contact,
Properties: LinkedIn_Profile__c, IsBatchRun__c, IsBatchRunForEvents__c, IsBatchRunForContentInteraction__c, IsDeleted, Id, LastModifiedById, rules_applied, confidence_score, bookmark, MasterRecordId, AccountId, ReportsToId, OwnerId, CreatedById, Salutation, MiddleName, Suffix, Name, MailingStreet`,
`TableName: Contact,
Properties: MailingCity, MailingState, MailingPostalCode, MailingCountry, MailingLatitude, MailingLongitude, MailingGeocodeAccuracy, LastName, MailingAddress, Fax`,
`TableName: ContentDocument,
Properties: SharingPrivacy, ArchivedDate, IsArchived, LastModifiedDate, CreatedDate, Id, PublishStatus, LastViewedDate, LastReferencedDate, Description, ContentSize, FileType, FileExtension, SharingOption, Title, ContentModifiedDate, LatestPublishedVersionId, OwnerId, ArchivedById, SystemModstamp`,
`TableName: ContentDocument,
Properties: IsDeleted, LastModifiedById, CreatedById, rules_applied, confidence_score, bookmark`,
`TableName: ContentVersion,
Properties: ExternalDocumentInfo1, Id, IsLatest, ContentUrl, VersionNumber, Title, Description, ReasonForChange, SharingOption, SharingPrivacy, PathOnClient, RatingCount, IsDeleted, ContentModifiedDate, PositiveRatingCount, NegativeRatingCount, FeaturedContentBoost, FeaturedContentDate, CreatedDate, LastModifiedDate`,
`TableName: ContentVersion,
Properties: SystemModstamp, TagCsv, FileType, PublishStatus, VersionData, ContentSize, FileExtension, Origin, ContentLocation, TextPreview, ExternalDocumentInfo2, Checksum, IsMajorVersion, IsAssetEnabled, VersionDataUrl, rules_applied, confidence_score, bookmark, FirstPublishLocationId, LastModifiedById`,
`TableName: ContentVersion,
Properties: CreatedById, OwnerId, ContentModifiedById, ContentDocumentId`,
`TableName: Dashboard,
Properties: RunningUserId, CreatedById, FolderId, Type, LastViewedDate, LastReferencedDate, DashboardResultRefreshedDate, DashboardResultRunningUser, ColorPalette, ChartTheme, rules_applied, confidence_score, bookmark, Id, Description, NamespacePrefix, DeveloperName, Title, FolderName, IsDeleted`,
`TableName: Dashboard,
Properties: MiddleSize, RightSize, CreatedDate, LastModifiedDate, SystemModstamp, TitleColor, TitleSize, TextColor, BackgroundStart, LeftSize, LastModifiedById, BackgroundEnd, BackgroundDirection`,
`TableName: Document,
Properties: Id, IsDeleted, Name, DeveloperName, NamespacePrefix, ContentType, Type, IsPublic, Keywords, bookmark, confidence_score, rules_applied, LastReferencedDate, IsInternalUseOnly, LastModifiedById, CreatedById, AuthorId, BodyLength, CreatedDate, LastModifiedDate`,
`TableName: Document,
Properties: SystemModstamp, IsBodySearchable, LastViewedDate, FolderId, Body, Url, Description`,
`TableName: DuplicateRule,
Properties: CreatedById, bookmark, confidence_score, rules_applied, LastViewedDate, SobjectSubtype, SobjectType, DeveloperName, Language, MasterLabel, NamespacePrefix, CreatedDate, LastModifiedDate, SystemModstamp, IsActive, LastModifiedById, Id, IsDeleted`,
`TableName: EmailTemplate,
Properties: FolderId, CreatedById, LastModifiedById, Id, Name, DeveloperName, NamespacePrefix, FolderName, bookmark, TemplateStyle, IsActive, TemplateType, Encoding, Description, Subject, HtmlValue, Body, TimesUsed, LastUsedDate, CreatedDate`,
`TableName: EmailTemplate,
Properties: LastModifiedDate, SystemModstamp, ApiVersion, Markup, UiType, RelatedEntityType, IsBuilderContent, rules_applied, confidence_score, OwnerId`,
`TableName: Event,
Properties: IsArchived, WhatId, WhoId, DurationInMinutes, StartDateTime, EndDateTime, EndDate, Description, Type, IsPrivate, ShowAs, IsDeleted, IsChild, IsGroupEvent, GroupEventType, CreatedDate, LastModifiedDate, SystemModstamp, AccountId, IsRecurrence`,
`TableName: Event,
Properties: RecurrenceStartDateTime, RecurrenceEndDateOnly, RecurrenceTimeZoneSidKey, RecurrenceType, RecurrenceInterval, RecurrenceDayOfWeekMask, RecurrenceDayOfMonth, RecurrenceInstance, RecurrenceMonthOfYear, ReminderDateTime, IsReminderSet, EventSubtype, IsRecurrence2Exclusion, Recurrence2PatternText, Recurrence2PatternVersion, IsRecurrence2, IsRecurrence2Exception, Recurrence2PatternStartDate, Recurrence2PatternTimeZone, Response_Status__c`,
`TableName: Event,
Properties: rules_applied, confidence_score, bookmark, Id, WhoCount, WhatCount, Subject, Location, IsAllDayEvent, ActivityDateTime, ActivityDate, RecurrenceActivityId, LastModifiedById, CreatedById, OwnerId`,
`TableName: FeedItem,
Properties: Body, Title, LikeCount, CommentCount, LastEditDate, Revision, SystemModstamp, LastModifiedDate, IsDeleted, CreatedDate, Type, Id, InsertedById, ParentId, CreatedById, LastEditById, RelatedRecordId, bookmark, confidence_score, rules_applied`,
`TableName: FeedItem,
Properties: Status, IsClosed, HasVerifiedComment, HasFeedEntity, HasLink, HasContent, IsRichText, LinkUrl`,
`TableName: Folder,
Properties: bookmark, confidence_score, rules_applied, SystemModstamp, LastModifiedDate, CreatedDate, NamespacePrefix, Type, IsReadonly, AccessType, DeveloperName, Name, Id, LastModifiedById, CreatedById, ParentId`,
`TableName: Group,
Properties: LastModifiedById, CreatedById, OwnerId, RelatedId, bookmark, confidence_score, rules_applied, Id, Name, DeveloperName, Type, Email, DoesSendEmailToMembers, DoesIncludeBosses, CreatedDate, LastModifiedDate, SystemModstamp`,
`TableName: In_App_Checklist_Settings__c,
Properties: SetupOwnerId, Id, bookmark, confidence_score, LastModifiedById, rules_applied, Sales_Cloud_In_App_Page__c, ProfileKey__c, SystemModstamp, LastModifiedDate, CreatedDate, Name, IsDeleted, CreatedById`,
`TableName: Lead,
Properties: OwnerId, Id, IsDeleted, LastName, FirstName, Salutation, MiddleName, Suffix, Name, Title, Company, Street, City, State, PostalCode, Country, Latitude, Longitude, GeocodeAccuracy, Address`,
`TableName: Lead,
Properties: Phone, MobilePhone, Email, Website, PhotoUrl, LeadSource, Status, Industry, Rating, AnnualRevenue, NumberOfEmployees, IsConverted, ConvertedDate, IsUnreadByOwner, CreatedDate, LastModifiedDate, SystemModstamp, LastActivityDate, LastViewedDate, LastReferencedDate`,
`TableName: Lead,
Properties: Jigsaw, JigsawContactId, EmailBouncedReason, EmailBouncedDate, Sales_Rep__c, Lead_Scoring__c, rules_applied, confidence_score, bookmark, ConvertedContactId, ConvertedOpportunityId, MasterRecordId, ConvertedAccountId, CreatedById, LastModifiedById`,
`TableName: ListView,
Properties: SystemModstamp, LastViewedDate, LastReferencedDate, NamespacePrefix, rules_applied, confidence_score, bookmark, SobjectType, LastModifiedById, CreatedById, DeveloperName, IsSoqlCompatible, Name, Id, CreatedDate, LastModifiedDate`,
`TableName: Note,
Properties: bookmark, LastModifiedById, CreatedById, OwnerId, ParentId, Body, Id, IsDeleted, Title, IsPrivate, CreatedDate, LastModifiedDate, SystemModstamp, rules_applied, confidence_score`,
`TableName: Opportunity,
Properties: Description, bookmark, confidence_score, rules_applied, Loss_Reason__c, ROI_Analysis_Completed__c, Discovery_Completed__c, Budget_Confirmed__c, HasOverdueTask, HasOpenActivity, LastReferencedDate, LastViewedDate, Fiscal, FiscalYear, FiscalQuarter, LastStageChangeDate, PushCount, LastActivityDate, SystemModstamp, LastModifiedDate`,
`TableName: Opportunity,
Properties: CreatedDate, HasOpportunityLineItem, ForecastCategoryName, ForecastCategory, IsWon, IsClosed, LeadSource, NextStep, Type, CloseDate, Probability, Amount, StageName, AccountId, CampaignId, Pricebook2Id, OwnerId, CreatedById, LastModifiedById, ContactId`,
`TableName: Opportunity,
Properties: Name, IsDeleted, Id`,
`TableName: Pricebook2,
Properties: IsArchived, Description, CreatedById, LastModifiedById, IsStandard, rules_applied, confidence_score, bookmark, Id, IsDeleted, Name, CreatedDate, LastModifiedDate, SystemModstamp, LastViewedDate, LastReferencedDate, IsActive`,
`TableName: Product2,
Properties: DisplayUrl, QuantityUnitOfMeasure, LastModifiedById, Id, Name, ProductCode, Description, IsActive, CreatedDate, LastModifiedDate, IsDeleted, IsArchived, LastViewedDate, bookmark, confidence_score, rules_applied, Product_Id__c, SystemModstamp, Family, LastReferencedDate`,
`TableName: Product2,
Properties: Weight__c, Release_Date__c, StockKeepingUnit, CreatedById, ExternalId`,
`TableName: Profile,
Properties: PermissionsManageTrustMeasures, Id, Name, PermissionsEmailSingle, PermissionsEmailMass, PermissionsEditTask, PermissionsEditEvent, PermissionsExportReport, PermissionsImportPersonal, PermissionsDataExport, PermissionsManageUsers, PermissionsEditPublicFilters, PermissionsEditPublicTemplates, PermissionsModifyAllData, PermissionsEditBillingInfo, PermissionsManageCases, PermissionsMassInlineEdit, PermissionsManageSolutions, PermissionsCustomizeApplication, PermissionsEditReadonlyFields`,
`TableName: Profile,
Properties: PermissionsRunReports, PermissionsViewSetup, PermissionsTransferAnyEntity, PermissionsNewReportBuilder, PermissionsActivateContract, PermissionsActivateOrder, PermissionsImportLeads, PermissionsManageLeads, PermissionsTransferAnyLead, PermissionsViewAllData, PermissionsEditPublicDocuments, PermissionsViewEncryptedData, PermissionsEditBrandTemplates, PermissionsEditHtmlTemplates, PermissionsChatterInternalUser, PermissionsManageTranslation, PermissionsDeleteActivatedContract, PermissionsChatterInviteExternalUsers, PermissionsSendSitRequests, PermissionsOverrideForecasts`,
`TableName: Profile,
Properties: PermissionsViewAllForecasts, PermissionsApiUserOnly, PermissionsManageRemoteAccess, PermissionsCanUseNewDashboardBuilder, PermissionsManageCategories, PermissionsConvertLeads, PermissionsPasswordNeverExpires, PermissionsUseTeamReassignWizards, PermissionsEditActivatedOrders, PermissionsInstallMultiforce, PermissionsPublishMultiforce, PermissionsChatterOwnGroups, PermissionsEditOppLineItemUnitPrice, PermissionsCreateMultiforce, PermissionsBulkApiHardDelete, PermissionsInboundMigrationToolsUser, PermissionsSolutionImport, PermissionsManageCallCenters, PermissionsManageSynonyms, PermissionsOutboundMigrationToolsUser`,
`TableName: Profile,
Properties: PermissionsViewContent, PermissionsManageEmailClientConfig, PermissionsEnableNotifications, PermissionsManageDataIntegrations, PermissionsDistributeFromPersWksp, PermissionsViewDataCategories, PermissionsManageDataCategories, PermissionsAuthorApex, PermissionsManageMobile, PermissionsApiEnabled, PermissionsManageCustomReportTypes, PermissionsEditCaseComments, PermissionsTransferAnyCase, PermissionsContentAdministrator, PermissionsCreateWorkspaces, PermissionsManageContentPermissions, PermissionsManageContentProperties, PermissionsManageContentTypes, PermissionsScheduleJob, PermissionsManageExchangeConfig`,
`TableName: Profile,
Properties: PermissionsManageAnalyticSnapshots, PermissionsScheduleReports, PermissionsManageBusinessHourHolidays, PermissionsManageDynamicDashboards, PermissionsCustomSidebarOnAllPages, PermissionsManageInteraction, PermissionsViewMyTeamsDashboards, PermissionsModerateChatter, PermissionsResetPasswords, PermissionsFlowUFLRequired, PermissionsCanInsertFeedSystemFields, PermissionsActivitiesAccess, PermissionsEmailTemplateManagement, PermissionsEmailAdministration, PermissionsManageChatterMessages, PermissionsAllowEmailIC, PermissionsChatterFileLink, PermissionsForceTwoFactor, PermissionsViewEventLogFiles, PermissionsManageNetworks`,
`TableName: Profile,
Properties: PermissionsViewCaseInteraction, PermissionsManageAuthProviders, PermissionsRunFlow, PermissionsManageQuotas, PermissionsCreateCustomizeDashboards, PermissionsCreateDashboardFolders, PermissionsViewPublicDashboards, PermissionsManageDashbdsInPubFolders, PermissionsCreateCustomizeReports, PermissionsCreateReportFolders, PermissionsViewPublicReports, PermissionsManageReportsInPubFolders, PermissionsEditMyDashboards, PermissionsEditMyReports, PermissionsViewAllUsers, PermissionsConnectOrgToEnvironmentHub, PermissionsCreateCustomizeFilters, PermissionsContentHubUser, PermissionsGovernNetworks, PermissionsSalesConsole`,
`TableName: Profile,
Properties: PermissionsTwoFactorApi, PermissionsDeleteTopics, PermissionsEditTopics, PermissionsCreateTopics, PermissionsAssignTopics, PermissionsIdentityEnabled, PermissionsIdentityConnect, PermissionsContentWorkspaces, PermissionsCreateWorkBadgeDefinition, PermissionsCustomMobileAppsAccess, PermissionsViewHelpLink, PermissionsManageProfilesPermissionsets, PermissionsAssignPermissionSets, PermissionsManageRoles, PermissionsManageIpAddresses, PermissionsManageSharing, PermissionsManageInternalUsers, PermissionsManagePasswordPolicies, PermissionsManageLoginAccessPolicies, PermissionsManageCustomPermissions`,
`TableName: Profile,
Properties: PermissionsCanVerifyComment, PermissionsManageUnlistedGroups, PermissionsStdAutomaticActivityCapture, PermissionsManageTwoFactor, PermissionsLightningExperienceUser, PermissionsConfigCustomRecs, PermissionsSubmitMacrosAllowed, PermissionsBulkMacrosAllowed, PermissionsManageSessionPermissionSets, PermissionsSendAnnouncementEmails, PermissionsChatterEditOwnPost, PermissionsChatterEditOwnRecordPost, PermissionsCreateAuditFields, PermissionsUpdateWithInactiveOwner, PermissionsManageSandboxes, PermissionsAutomaticActivityCapture, PermissionsImportCustomObjects, PermissionsSalesforceIQInbox, PermissionsDelegatedTwoFactor, PermissionsChatterComposeUiCodesnippet`,
`TableName: Profile,
Properties: PermissionsSelectFilesFromSalesforce, PermissionsModerateNetworkUsers, PermissionsMergeTopics, PermissionsSubscribeToLightningReports, PermissionsManagePvtRptsAndDashbds, PermissionsAllowLightningLogin, PermissionsCampaignInfluence2, PermissionsViewDataAssessment, PermissionsRemoveDirectMessageMembers, PermissionsCanApproveFeedPost, PermissionsAddDirectMessageMembers, PermissionsAllowViewEditConvertedLeads, PermissionsShowCompanyNameAsUserBadge, PermissionsAccessCMC, PermissionsViewHealthCheck, PermissionsManageHealthCheck, PermissionsPackaging2, PermissionsManageCertificates, PermissionsCreateReportInLightning, PermissionsPreventClassicExperience`,
`TableName: Profile,
Properties: PermissionsHideReadByList, PermissionsListEmailSend, PermissionsFeedPinning, PermissionsChangeDashboardColors, PermissionsManageRecommendationStrategies, PermissionsManagePropositions, PermissionsCloseConversations, PermissionsSubscribeReportRolesGrps, PermissionsSubscribeDashboardRolesGrps, PermissionsUseWebLink, PermissionsHasUnlimitedNBAExecutions, PermissionsViewOnlyEmbeddedAppUser, PermissionsSendExternalEmailAvailable, PermissionsViewAllActivities, PermissionsSubscribeReportToOtherUsers, PermissionsLightningConsoleAllowedForUser, PermissionsSubscribeReportsRunAsUser, PermissionsSubscribeToLightningDashboards, PermissionsSubscribeDashboardToOtherUsers, PermissionsCreateLtngTempInPub`,
`TableName: Profile,
Properties: PermissionsTransactionalEmailSend, PermissionsViewPrivateStaticResources, PermissionsCreateLtngTempFolder, PermissionsApexRestServices, PermissionsGiveRecognitionBadge, PermissionsAllowObjectDetection, PermissionsSalesforceIQInternal, PermissionsUseMySearch, PermissionsLtngPromoReserved01UserPerm, PermissionsManageSubscriptions, PermissionsAllowObjectDetectionTraining, PermissionsManageSurveys, PermissionsUseAssistantDialog, PermissionsUseQuerySuggestions, PermissionsViewRoles, PermissionsLMOutboundMessagingUserPerm, PermissionsModifyDataClassification, PermissionsPrivacyDataAccess, PermissionsQueryAllFiles, PermissionsModifyMetadata`,
`TableName: Profile,
Properties: PermissionsManageCMS, PermissionsSandboxTestingInCommunityApp, PermissionsCanEditPrompts, PermissionsViewUserPII, PermissionsManageHubConnections, PermissionsB2BMarketingAnalyticsUser, PermissionsTraceXdsQueries, PermissionsViewAllCustomSettings, PermissionsViewAllForeignKeyNames, PermissionsHeadlessCMSAccess, PermissionsLMEndMessagingSessionUserPerm, PermissionsConsentApiUpdate, PermissionsAccessContentBuilder, PermissionsManageC360AConnections, PermissionsManageReleaseUpdates, PermissionsViewAllProfiles, PermissionsSkipIdentityConfirmation, PermissionsLearningManager, PermissionsSendCustomNotifications, PermissionsPackaging2Delete`,
`TableName: Profile,
Properties: PermissionsViewTrustMeasures, PermissionsManageLearningReporting, PermissionsIsotopeCToCUser, PermissionsHasUnlimitedErbScoringRequests, PermissionsIsotopeAccess, PermissionsIsotopeLEX, PermissionsQuipMetricsAccess, PermissionsQuipUserEngagementMetrics, PermissionsManageExternalConnections, PermissionsAIViewInsightObjects, PermissionsAICreateInsightObjects, PermissionsViewMLModels, PermissionsNativeWebviewScrolling, PermissionsViewDeveloperName, PermissionsBypassMFAForUiLogins, PermissionsClientSecretRotation, PermissionsUpdateReportTypeReferences, PermissionsAccessToServiceProcess, PermissionsManageOrchInstsAndWorkItems, PermissionsManageDataspaceScope`,
`TableName: Profile,
Properties: PermissionsConfigureDataspaceScope, PermissionsEnableIPFSUpload, PermissionsEnableBCTransactionPolling, PermissionsFSCArcGraphCommunityUser, UserType, CreatedDate, LastModifiedDate, SystemModstamp, Description, LastViewedDate, LastReferencedDate, rules_applied, confidence_score, bookmark, CreatedById, LastModifiedById`,
`TableName: Report,
Properties: bookmark, confidence_score, rules_applied, LastReferencedDate, LastViewedDate, Format, SystemModstamp, LastRunDate, NamespacePrefix, DeveloperName, LastModifiedById, OwnerId, CreatedById, Id, FolderName, CreatedDate, LastModifiedDate, IsDeleted, Name, Description`,
`TableName: SocialPersona,
Properties: Bio, MediaType, AreWeFollowing, IsFollowingUs, RealName, IsBlacklisted, TopicType, ProfileUrl, ExternalPictureURL, IsDefault, ExternalId, Provider, LastReferencedDate, LastViewedDate, SystemModstamp, LastModifiedDate, CreatedDate, IsDeleted, Id, CreatedById`,
`TableName: SocialPersona,
Properties: Name, ParentId, LastModifiedById, bookmark, confidence_score, rules_applied, AvatarUrl, InfluencerScore, IsVerified, AuthorLabels, SourceApp, NumberOfTweets, R6SourceId, ProfileType, MediaProvider, ListedCount, NumberOfFriends, Following, Followers`,
`TableName: Task,
Properties: ActivityDate, CreatedById, AccountId, OwnerId, WhatId, WhoId, bookmark, confidence_score, rules_applied, Response_Status__c, CompletedDateTime, TaskSubtype, RecurrenceRegeneratedType, RecurrenceMonthOfYear, RecurrenceInstance, RecurrenceDayOfMonth, RecurrenceDayOfWeekMask, RecurrenceInterval, RecurrenceType, RecurrenceTimeZoneSidKey`,
`TableName: Task,
Properties: RecurrenceEndDateOnly, RecurrenceStartDateOnly, IsRecurrence, IsReminderSet, ReminderDateTime, CallObject, CallDisposition, CallDurationInSeconds, IsArchived, SystemModstamp, LastModifiedDate, CreatedDate, IsClosed, IsDeleted, Type, Description, IsHighPriority, Priority, Status, LastModifiedById`,
`TableName: Task,
Properties: Subject, WhatCount, WhoCount, Id, RecurrenceActivityId, CallType`,
`TableName: Topic,
Properties: Description, CreatedDate, TalkingAbout, ManagedTopicType, SystemModstamp, rules_applied, bookmark, CreatedById, confidence_score, Id, Name`,
`TableName: User,
Properties: BadgeText, CommunityNickname, Alias, MobilePhone, Fax, Phone, StayInTouchNote, StayInTouchSignature, StayInTouchSubject, Signature, SenderName, SenderEmail, EmailPreferencesStayInTouchReminder, EmailPreferencesAutoBccStayInTouch, EmailPreferencesAutoBcc, LanguageLocaleKey, Address, GeocodeAccuracy, Longitude, Latitude`,
`TableName: User,
Properties: Country, PostalCode, State, City, Street, Title, Department, Division, CompanyName, Name, Suffix, MiddleName, FirstName, LastName, Username, Id, AboutMe, Email, EmployeeNumber, LastLoginDate`,
`TableName: User,
Properties: LastPasswordChangeDate, CreatedDate, LastModifiedDate, SystemModstamp, NumberOfFailedLogins, OfflineTrialExpirationDate, OfflinePdaTrialExpirationDate, UserPermissionsMarketingUser, UserPermissionsOfflineUser, UserPermissionsAvantgoUser, UserPermissionsCallCenterAutoLogin, UserPermissionsSFContentUser, UserPermissionsInteractionUser, UserPermissionsSupportUser, ForecastEnabled, UserPreferencesActivityRemindersPopup, UserPreferencesEventRemindersCheckboxDefault, UserPreferencesTaskRemindersCheckboxDefault, UserPreferencesReminderSoundOff, UserPreferencesDisableAllFeedsEmail`,
`TableName: User,
Properties: UserPreferencesDisableFollowersEmail, UserPreferencesDisableProfilePostEmail, UserPreferencesDisableChangeCommentEmail, UserPreferencesDisableLaterCommentEmail, UserPreferencesDisProfPostCommentEmail, UserPreferencesApexPagesDeveloperMode, UserPreferencesReceiveNoNotificationsAsApprover, UserPreferencesReceiveNotificationsAsDelegatedApprover, UserPreferencesHideCSNGetChatterMobileTask, UserPreferencesDisableMentionsPostEmail, UserPreferencesDisMentionsCommentEmail, UserPreferencesHideCSNDesktopTask, UserPreferencesHideChatterOnboardingSplash, UserPreferencesHideSecondChatterOnboardingSplash, UserPreferencesDisCommentAfterLikeEmail, UserPreferencesDisableLikeEmail, UserPreferencesSortFeedByComment, UserPreferencesDisableMessageEmail, UserPreferencesDisableBookmarkEmail, UserPreferencesDisableSharePostEmail`,
`TableName: User,
Properties: UserPreferencesEnableAutoSubForFeeds, UserPreferencesDisableFileShareNotificationsForApi, UserPreferencesShowTitleToExternalUsers, UserPreferencesShowManagerToExternalUsers, UserPreferencesShowEmailToExternalUsers, UserPreferencesShowWorkPhoneToExternalUsers, UserPreferencesShowMobilePhoneToExternalUsers, UserPreferencesShowFaxToExternalUsers, UserPreferencesShowStreetAddressToExternalUsers, UserPreferencesShowCityToExternalUsers, UserPreferencesShowStateToExternalUsers, UserPreferencesShowPostalCodeToExternalUsers, UserPreferencesShowCountryToExternalUsers, UserPreferencesShowProfilePicToGuestUsers, UserPreferencesShowTitleToGuestUsers, UserPreferencesShowCityToGuestUsers, UserPreferencesShowStateToGuestUsers, UserPreferencesShowPostalCodeToGuestUsers, UserPreferencesShowCountryToGuestUsers, UserPreferencesShowForecastingChangeSignals`,
`TableName: User,
Properties: UserPreferencesHideS1BrowserUI, UserPreferencesDisableEndorsementEmail, UserPreferencesPathAssistantCollapsed, UserPreferencesCacheDiagnostics, UserPreferencesShowEmailToGuestUsers, UserPreferencesShowManagerToGuestUsers, UserPreferencesShowWorkPhoneToGuestUsers, UserPreferencesShowMobilePhoneToGuestUsers, UserPreferencesShowFaxToGuestUsers, UserPreferencesShowStreetAddressToGuestUsers, UserPreferencesLightningExperiencePreferred, UserPreferencesPreviewLightning, UserPreferencesHideEndUserOnboardingAssistantModal, UserPreferencesHideLightningMigrationModal, UserPreferencesHideSfxWelcomeMat, UserPreferencesHideBiggerPhotoCallout, UserPreferencesGlobalNavBarWTShown, UserPreferencesGlobalNavGridMenuWTShown, UserPreferencesCreateLEXAppsWTShown, UserPreferencesFavoritesWTShown`,
`TableName: User,
Properties: UserPreferencesRecordHomeSectionCollapseWTShown, UserPreferencesRecordHomeReservedWTShown, UserPreferencesFavoritesShowTopFavorites, UserPreferencesExcludeMailAppAttachments, UserPreferencesSuppressTaskSFXReminders, UserPreferencesSuppressEventSFXReminders, UserPreferencesPreviewCustomTheme, UserPreferencesHasCelebrationBadge, UserPreferencesUserDebugModePref, UserPreferencesSRHOverrideActivities, UserPreferencesNewLightningReportRunPageEnabled, UserPreferencesReverseOpenActivitiesView, UserPreferencesHasSentWarningEmail, UserPreferencesHasSentWarningEmail238, UserPreferencesHasSentWarningEmail240, UserPreferencesNativeEmailClient, UserPreferencesSendListEmailThroughExternalService, UserPreferencesHideBrowseProductRedirectConfirmation, UserPreferencesHideOnlineSalesAppWelcomeMat, Extension`,
`TableName: User,
Properties: FederationIdentifier, FullPhotoUrl, SmallPhotoUrl, IsExtIndicatorVisible, OutOfOfficeMessage, MediumPhotoUrl, DigestFrequency, DefaultGroupNotificationFrequency, LastViewedDate, LastReferencedDate, BannerPhotoUrl, SmallBannerPhotoUrl, MediumBannerPhotoUrl, IsProfilePhotoActive, rules_applied, confidence_score, bookmark, ReceivesAdminInfoEmails, ReceivesInfoEmails, LocaleSidKey`,
`TableName: User,
Properties: TimeZoneSidKey, IsActive, ProfileId, DelegatedApproverId, ManagerId, CreatedById, LastModifiedById, ContactId, AccountId, EmailEncodingKey, UserType`,
`TableName: WorkBadgeDefinition,
Properties: IsActive, ImageUrl, Description, IsCompanyWide, LastReferencedDate, LastViewedDate, SystemModstamp, LastModifiedDate, CreatedDate, Name, IsDeleted, Id, OwnerId, LastModifiedById, CreatedById, bookmark, confidence_score, rules_applied, IsRewardBadge, GivenBadgeCount`,
]

let relarr = [        
    ` The 'Account' table has a field named 'ParentId', which acts as a foreign key referencing the primary key in the 'Account' table. This relationship is uniquely identified by the name 'Parent'.
    > The 'Account' table has a field named 'OwnerId', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'Owner'.
    > The 'Account' table has a field named 'CreatedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'CreatedBy'.
    > The 'Account' table has a field named 'LastModifiedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'LastModifiedBy'.`,

    ` The 'BusinessHours' table has a field named 'CreatedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'CreatedBy'.
    > The 'BusinessHours' table has a field named 'LastModifiedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'LastModifiedBy'.`,

    ` The 'Calendar' table has a field named 'CreatedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'CreatedBy'.
    > The 'Calendar' table has a field named 'LastModifiedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'LastModifiedBy'.`,


    ` The 'Campaign' table has a field named 'ParentId', which acts as a foreign key referencing the primary key in the 'Campaign' table. This relationship is uniquely identified by the name 'Parent'.
    > The 'Campaign' table has a field named 'OwnerId', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'Owner'.
    > The 'Campaign' table has a field named 'CreatedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'CreatedBy'.
    > The 'Campaign' table has a field named 'LastModifiedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'LastModifiedBy'.`,

    ` The 'Case' table has a field named 'MasterRecordId', which acts as a foreign key referencing the primary key in the 'Case' table. This relationship is uniquely identified by the name 'MasterRecord'.
    > The 'Case' table has a field named 'ContactId', which acts as a foreign key referencing the primary key in the 'Contact' table. This relationship is uniquely identified by the name 'Contact'.
    > The 'Case' table has a field named 'AccountId', which acts as a foreign key referencing the primary key in the 'Account' table. This relationship is uniquely identified by the name 'Account'.
    > The 'Case' table has a field named 'ParentId', which acts as a foreign key referencing the primary key in the 'Case' table. This relationship is uniquely identified by the name 'Parent'.
    > The 'Case' table has a field named 'OwnerId', which acts as a foreign key referencing the primary key in the 'Group' table. This relationship is uniquely identified by the name 'Owner'.
    > The 'Case' table has a field named 'OwnerId', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'Owner'.
    > The 'Case' table has a field named 'CreatedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'CreatedBy'.
    > The 'Case' table has a field named 'LastModifiedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'LastModifiedBy'.`,

    ` The 'Contact' table has a field named 'MasterRecordId', which acts as a foreign key referencing the primary key in the 'Contact' table. This relationship is uniquely identified by the name 'MasterRecord'.
    > The 'Contact' table has a field named 'AccountId', which acts as a foreign key referencing the primary key in the 'Account' table. This relationship is uniquely identified by the name 'Account'.
    > The 'Contact' table has a field named 'ReportsToId', which acts as a foreign key referencing the primary key in the 'Contact' table. This relationship is uniquely identified by the name 'ReportsTo'.
    > The 'Contact' table has a field named 'OwnerId', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'Owner'.
    > The 'Contact' table has a field named 'CreatedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'CreatedBy'.
    > The 'Contact' table has a field named 'LastModifiedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'LastModifiedBy'.`,

    ` The 'ContentDocument' table has a field named 'CreatedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'CreatedBy'.
    > The 'ContentDocument' table has a field named 'LastModifiedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'LastModifiedBy'.
    > The 'ContentDocument' table has a field named 'OwnerId', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'Owner'.
    > The 'ContentDocument' table has a field named 'LatestPublishedVersionId', which acts as a foreign key referencing the primary key in the 'ContentVersion' table. This relationship is uniquely identified by the name 'LatestPublishedVersion'.`,

    ` The 'ContentVersion' table has a field named 'ContentDocumentId', which acts as a foreign key referencing the primary key in the 'ContentDocument' table. This relationship is uniquely identified by the name 'ContentDocument'.
    > The 'ContentVersion' table has a field named 'ContentModifiedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'ContentModifiedBy'.
    > The 'ContentVersion' table has a field named 'OwnerId', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'Owner'.
    > The 'ContentVersion' table has a field named 'CreatedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'CreatedBy'.
    > The 'ContentVersion' table has a field named 'LastModifiedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'LastModifiedBy'.
    > The 'ContentVersion' table has a field named 'FirstPublishLocationId', which acts as a foreign key referencing the primary key in the 'Account' table. This relationship is uniquely identified by the name 'FirstPublishLocation'.
    > The 'ContentVersion' table has a field named 'FirstPublishLocationId', which acts as a foreign key referencing the primary key in the 'Campaign' table. This relationship is uniquely identified by the name 'FirstPublishLocation'.
    > The 'ContentVersion' table has a field named 'FirstPublishLocationId', which acts as a foreign key referencing the primary key in the 'Case' table. This relationship is uniquely identified by the name 'FirstPublishLocation'.
    > The 'ContentVersion' table has a field named 'FirstPublishLocationId', which acts as a foreign key referencing the primary key in the 'Contact' table. This relationship is uniquely identified by the name 'FirstPublishLocation'.
    > The 'ContentVersion' table has a field named 'FirstPublishLocationId', which acts as a foreign key referencing the primary key in the 'Dashboard' table. This relationship is uniquely identified by the name 'FirstPublishLocation'.
    > The 'ContentVersion' table has a field named 'FirstPublishLocationId', which acts as a foreign key referencing the primary key in the 'EmailTemplate' table. This relationship is uniquely identified by the name 'FirstPublishLocation'.
    > The 'ContentVersion' table has a field named 'FirstPublishLocationId', which acts as a foreign key referencing the primary key in the 'Event' table. This relationship is uniquely identified by the name 'FirstPublishLocation'.
    > The 'ContentVersion' table has a field named 'FirstPublishLocationId', which acts as a foreign key referencing the primary key in the 'In_App_Checklist_Settings__c' table. This relationship is uniquely identified by the name 'FirstPublishLocation'.
    > The 'ContentVersion' table has a field named 'FirstPublishLocationId', which acts as a foreign key referencing the primary key in the 'Lead' table. This relationship is uniquely identified by the name 'FirstPublishLocation'.
    > The 'ContentVersion' table has a field named 'FirstPublishLocationId', which acts as a foreign key referencing the primary key in the 'Opportunity' table. This relationship is uniquely identified by the name 'FirstPublishLocation'.
    > The 'ContentVersion' table has a field named 'FirstPublishLocationId', which acts as a foreign key referencing the primary key in the 'Product2' table. This relationship is uniquely identified by the name 'FirstPublishLocation'.
    > The 'ContentVersion' table has a field named 'FirstPublishLocationId', which acts as a foreign key referencing the primary key in the 'Report' table. This relationship is uniquely identified by the name 'FirstPublishLocation'.
    > The 'ContentVersion' table has a field named 'FirstPublishLocationId', which acts as a foreign key referencing the primary key in the 'Task' table. This relationship is uniquely identified by the name 'FirstPublishLocation'.
    > The 'ContentVersion' table has a field named 'FirstPublishLocationId', which acts as a foreign key referencing the primary key in the 'Topic' table. This relationship is uniquely identified by the name 'FirstPublishLocation'.
    > The 'ContentVersion' table has a field named 'FirstPublishLocationId', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'FirstPublishLocation'.
    > The 'ContentVersion' table has a field named 'FirstPublishLocationId', which acts as a foreign key referencing the primary key in the 'WorkBadgeDefinition' table. This relationship is uniquely identified by the name 'FirstPublishLocation'.`,


    ` The 'Dashboard' table has a field named 'FolderId', which acts as a foreign key referencing the primary key in the 'Folder' table. This relationship is uniquely identified by the name 'Folder'.
    > The 'Dashboard' table has a field named 'FolderId', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'Folder'.`,


    ` The 'Dashboard' table has a field named 'CreatedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'CreatedBy'.
    > The 'Dashboard' table has a field named 'LastModifiedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'LastModifiedBy'.
    > The 'Dashboard' table has a field named 'RunningUserId', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'RunningUser'.
    > The 'Document' table has a field named 'FolderId', which acts as a foreign key referencing the primary key in the 'Folder' table. This relationship is uniquely identified by the name 'Folder'.
    > The 'Document' table has a field named 'FolderId', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'Folder'.
    > The 'Document' table has a field named 'AuthorId', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'Author'.
    > The 'Document' table has a field named 'CreatedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'CreatedBy'.
    > The 'Document' table has a field named 'LastModifiedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'LastModifiedBy'.`,

    ` The 'DuplicateRule' table has a field named 'CreatedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'CreatedBy'.
    > The 'DuplicateRule' table has a field named 'LastModifiedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'LastModifiedBy'.`,

    ` The 'EmailTemplate' table has a field named 'OwnerId', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'Owner'.
    > The 'EmailTemplate' table has a field named 'FolderId', which acts as a foreign key referencing the primary key in the 'Folder' table. This relationship is uniquely identified by the name 'Folder'.
    > The 'EmailTemplate' table has a field named 'FolderId', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'Folder'.
    > The 'EmailTemplate' table has a field named 'CreatedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'CreatedBy'.
    > The 'EmailTemplate' table has a field named 'LastModifiedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'LastModifiedBy'.`,
    
    ` The 'Event' table has a field named 'WhoId', which acts as a foreign key referencing the primary key in the 'Contact' table. This relationship is uniquely identified by the name 'Who'.
    > The 'Event' table has a field named 'WhoId', which acts as a foreign key referencing the primary key in the 'Lead' table. This relationship is uniquely identified by the name 'Who'.
    > The 'Event' table has a field named 'WhatId', which acts as a foreign key referencing the primary key in the 'Account' table. This relationship is uniquely identified by the name 'What'.
    > The 'Event' table has a field named 'WhatId', which acts as a foreign key referencing the primary key in the 'Campaign' table. This relationship is uniquely identified by the name 'What'.
    > The 'Event' table has a field named 'WhatId', which acts as a foreign key referencing the primary key in the 'Case' table. This relationship is uniquely identified by the name 'What'.
    > The 'Event' table has a field named 'WhatId', which acts as a foreign key referencing the primary key in the 'Opportunity' table. This relationship is uniquely identified by the name 'What'.
    > The 'Event' table has a field named 'WhatId', which acts as a foreign key referencing the primary key in the 'Product2' table. This relationship is uniquely identified by the name 'What'.
    > The 'Event' table has a field named 'AccountId', which acts as a foreign key referencing the primary key in the 'Account' table. This relationship is uniquely identified by the name 'Account'.
    > The 'Event' table has a field named 'OwnerId', which acts as a foreign key referencing the primary key in the 'Calendar' table. This relationship is uniquely identified by the name 'Owner'.
    > The 'Event' table has a field named 'OwnerId', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'Owner'.
    > The 'Event' table has a field named 'CreatedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'CreatedBy'.
    > The 'Event' table has a field named 'LastModifiedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'LastModifiedBy'.`,

    ` The 'FeedItem' table has a field named 'ParentId', which acts as a foreign key referencing the primary key in the 'Account' table. This relationship is uniquely identified by the name 'Parent'.
    > The 'FeedItem' table has a field named 'ParentId', which acts as a foreign key referencing the primary key in the 'Campaign' table. This relationship is uniquely identified by the name 'Parent'.
    > The 'FeedItem' table has a field named 'ParentId', which acts as a foreign key referencing the primary key in the 'Case' table. This relationship is uniquely identified by the name 'Parent'.
    > The 'FeedItem' table has a field named 'ParentId', which acts as a foreign key referencing the primary key in the 'Contact' table. This relationship is uniquely identified by the name 'Parent'.
    > The 'FeedItem' table has a field named 'ParentId', which acts as a foreign key referencing the primary key in the 'ContentDocument' table. This relationship is uniquely identified by the name 'Parent'.
    > The 'FeedItem' table has a field named 'ParentId', which acts as a foreign key referencing the primary key in the 'Dashboard' table. This relationship is uniquely identified by the name 'Parent'.
    > The 'FeedItem' table has a field named 'ParentId', which acts as a foreign key referencing the primary key in the 'Event' table. This relationship is uniquely identified by the name 'Parent'.
    > The 'FeedItem' table has a field named 'ParentId', which acts as a foreign key referencing the primary key in the 'In_App_Checklist_Settings__c' table. This relationship is uniquely identified by the name 'Parent'.
    > The 'FeedItem' table has a field named 'ParentId', which acts as a foreign key referencing the primary key in the 'Lead' table. This relationship is uniquely identified by the name 'Parent'.
    > The 'FeedItem' table has a field named 'ParentId', which acts as a foreign key referencing the primary key in the 'Opportunity' table. This relationship is uniquely identified by the name 'Parent'.
    > The 'FeedItem' table has a field named 'ParentId', which acts as a foreign key referencing the primary key in the 'Product2' table. This relationship is uniquely identified by the name 'Parent'.
    > The 'FeedItem' table has a field named 'ParentId', which acts as a foreign key referencing the primary key in the 'Report' table. This relationship is uniquely identified by the name 'Parent'.
    > The 'FeedItem' table has a field named 'ParentId', which acts as a foreign key referencing the primary key in the 'Task' table. This relationship is uniquely identified by the name 'Parent'.
    > The 'FeedItem' table has a field named 'ParentId', which acts as a foreign key referencing the primary key in the 'Topic' table. This relationship is uniquely identified by the name 'Parent'.
    > The 'FeedItem' table has a field named 'ParentId', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'Parent'.
    > The 'FeedItem' table has a field named 'ParentId', which acts as a foreign key referencing the primary key in the 'WorkBadgeDefinition' table. This relationship is uniquely identified by the name 'Parent'.
    > The 'FeedItem' table has a field named 'CreatedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'CreatedBy'.
    > The 'FeedItem' table has a field named 'InsertedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'InsertedBy'.`,


    ` The 'Folder' table has a field named 'CreatedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'CreatedBy'.
    > The 'Folder' table has a field named 'LastModifiedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'LastModifiedBy'.`,

    ` The 'Group' table has a field named 'RelatedId', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'Related'.
    > The 'Group' table has a field named 'OwnerId', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'Owner'.
    > The 'Group' table has a field named 'CreatedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'CreatedBy'.
    > The 'Group' table has a field named 'LastModifiedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'LastModifiedBy'.`,

    ` The 'In_App_Checklist_Settings__c' table has a field named 'SetupOwnerId', which acts as a foreign key referencing the primary key in the 'Profile' table. This relationship is uniquely identified by the name 'SetupOwner'.
    > The 'In_App_Checklist_Settings__c' table has a field named 'SetupOwnerId', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'SetupOwner'.
    > The 'In_App_Checklist_Settings__c' table has a field named 'CreatedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'CreatedBy'.
    > The 'In_App_Checklist_Settings__c' table has a field named 'LastModifiedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'LastModifiedBy'.`,

    ` The 'Lead' table has a field named 'MasterRecordId', which acts as a foreign key referencing the primary key in the 'Lead' table. This relationship is uniquely identified by the name 'MasterRecord'.
    > The 'Lead' table has a field named 'OwnerId', which acts as a foreign key referencing the primary key in the 'Group' table. This relationship is uniquely identified by the name 'Owner'.
    > The 'Lead' table has a field named 'OwnerId', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'Owner'.
    > The 'Lead' table has a field named 'ConvertedAccountId', which acts as a foreign key referencing the primary key in the 'Account' table. This relationship is uniquely identified by the name 'ConvertedAccount'.
    > The 'Lead' table has a field named 'ConvertedContactId', which acts as a foreign key referencing the primary key in the 'Contact' table. This relationship is uniquely identified by the name 'ConvertedContact'.
    > The 'Lead' table has a field named 'ConvertedOpportunityId', which acts as a foreign key referencing the primary key in the 'Opportunity' table. This relationship is uniquely identified by the name 'ConvertedOpportunity'.
    > The 'Lead' table has a field named 'CreatedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'CreatedBy'.
    > The 'Lead' table has a field named 'LastModifiedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'LastModifiedBy'.`,

    ` The 'ListView' table has a field named 'CreatedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'CreatedBy'.
    > The 'ListView' table has a field named 'LastModifiedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'LastModifiedBy'.`,

    ` The 'Note' table has a field named 'ParentId', which acts as a foreign key referencing the primary key in the 'Account' table. This relationship is uniquely identified by the name 'Parent'.
    > The 'Note' table has a field named 'ParentId', which acts as a foreign key referencing the primary key in the 'Contact' table. This relationship is uniquely identified by the name 'Parent'.
    > The 'Note' table has a field named 'ParentId', which acts as a foreign key referencing the primary key in the 'Lead' table. This relationship is uniquely identified by the name 'Parent'.
    > The 'Note' table has a field named 'ParentId', which acts as a foreign key referencing the primary key in the 'Opportunity' table. This relationship is uniquely identified by the name 'Parent'.
    > The 'Note' table has a field named 'ParentId', which acts as a foreign key referencing the primary key in the 'Product2' table. This relationship is uniquely identified by the name 'Parent'.
    > The 'Note' table has a field named 'OwnerId', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'Owner'.
    > The 'Note' table has a field named 'CreatedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'CreatedBy'.
    > The 'Note' table has a field named 'LastModifiedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'LastModifiedBy'.`,

    ` The 'Opportunity' table has a field named 'AccountId', which acts as a foreign key referencing the primary key in the 'Account' table. This relationship is uniquely identified by the name 'Account'.
    > The 'Opportunity' table has a field named 'CampaignId', which acts as a foreign key referencing the primary key in the 'Campaign' table. This relationship is uniquely identified by the name 'Campaign'.
    > The 'Opportunity' table has a field named 'Pricebook2Id', which acts as a foreign key referencing the primary key in the 'Pricebook2' table. This relationship is uniquely identified by the name 'Pricebook2'.
    > The 'Opportunity' table has a field named 'OwnerId', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'Owner'.
    > The 'Opportunity' table has a field named 'CreatedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'CreatedBy'.
    > The 'Opportunity' table has a field named 'LastModifiedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'LastModifiedBy'.`,


    ` The 'Pricebook2' table has a field named 'CreatedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'CreatedBy'.
    > The 'Pricebook2' table has a field named 'LastModifiedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'LastModifiedBy'.`,

    ` The 'Product2' table has a field named 'CreatedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'CreatedBy'.
    > The 'Product2' table has a field named 'LastModifiedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'LastModifiedBy'.`,

    ` The 'Profile' table has a field named 'CreatedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'CreatedBy'.
    > The 'Profile' table has a field named 'LastModifiedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'LastModifiedBy'.`,

    ` The 'Report' table has a field named 'OwnerId', which acts as a foreign key referencing the primary key in the 'Folder' table. This relationship is uniquely identified by the name 'Owner'.
    > The 'Report' table has a field named 'OwnerId', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'Owner'.
    > The 'Report' table has a field named 'CreatedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'CreatedBy'.
    > The 'Report' table has a field named 'LastModifiedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'LastModifiedBy'.`,

    ` The 'SocialPersona' table has a field named 'CreatedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'CreatedBy'.
    > The 'SocialPersona' table has a field named 'LastModifiedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'LastModifiedBy'.
    > The 'SocialPersona' table has a field named 'ParentId', which acts as a foreign key referencing the primary key in the 'Account' table. This relationship is uniquely identified by the name 'Parent'.
    > The 'SocialPersona' table has a field named 'ParentId', which acts as a foreign key referencing the primary key in the 'Contact' table. This relationship is uniquely identified by the name 'Parent'.
    > The 'SocialPersona' table has a field named 'ParentId', which acts as a foreign key referencing the primary key in the 'Lead' table. This relationship is uniquely identified by the name 'Parent'.`,

    ` The 'Task' table has a field named 'WhoId', which acts as a foreign key referencing the primary key in the 'Contact' table. This relationship is uniquely identified by the name 'Who'.
    > The 'Task' table has a field named 'WhoId', which acts as a foreign key referencing the primary key in the 'Lead' table. This relationship is uniquely identified by the name 'Who'.
    > The 'Task' table has a field named 'WhatId', which acts as a foreign key referencing the primary key in the 'Account' table. This relationship is uniquely identified by the name 'What'.
    > The 'Task' table has a field named 'WhatId', which acts as a foreign key referencing the primary key in the 'Campaign' table. This relationship is uniquely identified by the name 'What'.
    > The 'Task' table has a field named 'WhatId', which acts as a foreign key referencing the primary key in the 'Case' table. This relationship is uniquely identified by the name 'What'.
    > The 'Task' table has a field named 'WhatId', which acts as a foreign key referencing the primary key in the 'Opportunity' table. This relationship is uniquely identified by the name 'What'.
    > The 'Task' table has a field named 'WhatId', which acts as a foreign key referencing the primary key in the 'Product2' table. This relationship is uniquely identified by the name 'What'.
    > The 'Task' table has a field named 'OwnerId', which acts as a foreign key referencing the primary key in the 'Group' table. This relationship is uniquely identified by the name 'Owner'.
    > The 'Task' table has a field named 'OwnerId', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'Owner'.
    > The 'Task' table has a field named 'AccountId', which acts as a foreign key referencing the primary key in the 'Account' table. This relationship is uniquely identified by the name 'Account'.
    > The 'Task' table has a field named 'CreatedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'CreatedBy'.
    > The 'Task' table has a field named 'LastModifiedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'LastModifiedBy'.
    > The 'Topic' table has a field named 'CreatedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'CreatedBy'.`,

    ` The 'User' table has a field named 'ProfileId', which acts as a foreign key referencing the primary key in the 'Profile' table. This relationship is uniquely identified by the name 'Profile'.
    > The 'User' table has a field named 'ManagerId', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'Manager'.
    > The 'User' table has a field named 'CreatedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'CreatedBy'.
    > The 'User' table has a field named 'LastModifiedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'LastModifiedBy'.
    > The 'User' table has a field named 'ContactId', which acts as a foreign key referencing the primary key in the 'Contact' table. This relationship is uniquely identified by the name 'Contact'.
    > The 'User' table has a field named 'AccountId', which acts as a foreign key referencing the primary key in the 'Account' table. This relationship is uniquely identified by the name 'Account'.`,

    ` The 'WorkBadgeDefinition' table has a field named 'OwnerId', which acts as a foreign key referencing the primary key in the 'Group' table. This relationship is uniquely identified by the name 'Owner'.
    > The 'WorkBadgeDefinition' table has a field named 'OwnerId', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'Owner'.
    > The 'WorkBadgeDefinition' table has a field named 'CreatedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'CreatedBy'.
    >The 'WorkBadgeDefinition' table has a field named 'LastModifiedById', which acts as a foreign key referencing the primary key in the 'User' table. This relationship is uniquely identified by the name 'LastModifiedBy'.`,
]

let sqlSample = [`Aggregate revenue statistics by account type, showcasing aggregate functions and date manipulation.
        
SELECT
"Type",
COUNT(*) AS TotalAccounts,
SUM("AnnualRevenue") AS TotalRevenue,
AVG("AnnualRevenue") AS AverageRevenue,
MAX("LastModifiedDate") - MIN("CreatedDate") AS AccountLifespan
FROM
mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."Account"
GROUP BY
"Type";
`,

`Identify top-performing campaigns based on the number of opportunities won, using joins and aggregate functions.
    
SELECT
c."Name",
COUNT(o."Id") AS TotalWonOpportunities,
SUM(o."Amount") AS TotalWonAmount
FROM
mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."Campaign" c
JOIN
mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."Opportunity" o ON c."Id" = o."CampaignId"
WHERE
o."IsWon" = TRUE
GROUP BY
c."Name"
ORDER BY
TotalWonOpportunities DESC
LIMIT 5;
`,

`Create a view to easily access contact engagement, incorporating time-based categorization and window functions.
    
CREATE OR REPLACE VIEW contact_engagement AS
SELECT
"Id",
"Email",
"LastActivityDate",
CASE
    WHEN "LastActivityDate" >= NOW() - INTERVAL '30 days' THEN 'Active Recently'
    WHEN "LastActivityDate" < NOW() - INTERVAL '30 days' AND "LastActivityDate" >= NOW() - INTERVAL '90 days' THEN 'Active Previously'
    ELSE 'Inactive'
END AS EngagementCategory,
RANK() OVER (PARTITION BY "LastActivityDate"::DATE ORDER BY "LastActivityDate") AS DailyActivityRank
FROM
mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."Contact";
`,

`Analyze opportunity closure rates over time, showcasing date functions, categorization, and advanced statistical aggregation.
    
SELECT
EXTRACT(YEAR FROM "CloseDate") AS Year,
EXTRACT(MONTH FROM "CloseDate") AS Month,
COUNT(*) AS TotalOpportunities,
SUM(CASE WHEN "IsWon" = TRUE THEN 1 ELSE 0 END) AS WonOpportunities,
(SUM(CASE WHEN "IsWon" = TRUE THEN 1 ELSE 0 END)::FLOAT / COUNT(*)) * 100 AS WinRatePercentage
FROM
mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."Opportunity"
GROUP BY
Year,
Month
ORDER BY
Year,
Month;
`,


`Determine the average case resolution time and categorize cases by priority, showcasing date differences and case statements.
    
SELECT
"Priority",
AVG("ClosedDate" - "CreatedDate") AS AvgResolutionTimeDays
FROM
mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."Case"
WHERE
"IsClosed" = TRUE
GROUP BY
"Priority";
`,

`Analyze the usage of email templates, highlighting the most and least popular templates, and introduce a view for easier access.
    
CREATE OR REPLACE VIEW email_template_usage AS
SELECT
"Name",
"TimesUsed",
RANK() OVER (ORDER BY "TimesUsed" DESC) AS PopularityRank,
CASE
    WHEN "TimesUsed" > 100 THEN 'Highly Used'
    WHEN "TimesUsed" <= 100 AND "TimesUsed" > 10 THEN 'Moderately Used'
    ELSE 'Seldom Used'
END AS UsageCategory
FROM
mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."EmailTemplate";
`,

`Evaluate product inventory levels, incorporating conditional aggregates to identify low stock products.
    
SELECT
"Family",
COUNT(*) AS TotalProducts,
SUM(CASE WHEN "QuantityUnitOfMeasure" < 50 THEN 1 ELSE 0 END) AS LowStockProducts
FROM
mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."Product2"
WHERE
"IsActive" = TRUE
GROUP BY
"Family";
`,

`Aggregate social media engagement metrics by media type and provide a ranking system for influencers based on follower count.
    
SELECT
"MediaType",
SUM("Followers") AS TotalFollowers,
AVG("InfluencerScore") AS AvgInfluencerScore,
MAX("Followers") AS MaxFollowers,
(ROW_NUMBER() OVER (ORDER BY SUM("Followers") DESC)) AS MediaRank
FROM
mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."SocialPersona"
GROUP BY
"MediaType";
`,

`Analyze task completion rates by month, incorporating time-based grouping and percentage calculations.
    
SELECT
EXTRACT(YEAR FROM "ActivityDate") AS Year,
EXTRACT(MONTH FROM "ActivityDate") AS Month,
COUNT(*) AS TotalTasks,
SUM(CASE WHEN "IsClosed" = TRUE THEN 1 ELSE 0 END) AS CompletedTasks,
(SUM(CASE WHEN "IsClosed" = TRUE THEN 1 ELSE 0 END)::FLOAT / COUNT(*)) * 100 AS CompletionRate
FROM
mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."Task"
GROUP BY
Year, Month
ORDER BY
Year, Month;
`,

`Identify the distribution of group types and the average number of members per group type.
    
SELECT
"Type",
COUNT(*) AS TotalGroups,
AVG(member_count) AS AvgMembersPerGroup
FROM
mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."Group"
CROSS JOIN LATERAL (
SELECT COUNT(*) AS member_count
FROM mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."User"
WHERE "ManagerId" = mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."Group"."OwnerId"
) AS grp_members
GROUP BY "Type";
`,

`Create a ranked list of ListView by SObjectType, showcasing those most frequently used.
    
SELECT
"SobjectType",
"Name",
RANK() OVER (PARTITION BY "SobjectType" ORDER BY "LastViewedDate" DESC) AS ViewRank
FROM
mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."ListView"
WHERE
"LastViewedDate" IS NOT NULL;
`,

`Determine how note engagement varies by creation month and year, using date extraction and filtering for active notes.
    
SELECT
EXTRACT(YEAR FROM "CreatedDate") AS Year,
EXTRACT(MONTH FROM "CreatedDate") AS Month,
COUNT(*) AS TotalNotes,
SUM(CASE WHEN "IsPrivate" = FALSE THEN 1 ELSE 0 END) AS PublicNotes
FROM
mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."Note"
WHERE
"LastModifiedDate" > CURRENT_DATE - INTERVAL '1 year'
GROUP BY Year, Month
ORDER BY Year, Month;
`,

`Aggregate reports by format type and calculate average run time for each format.
    
SELECT
"Format",
COUNT(*) AS TotalReports,
AVG(EXTRACT(EPOCH FROM ("LastRunDate" - "CreatedDate")) / 60) AS AvgRunTimeMinutes
FROM
mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."Report"
GROUP BY "Format";
`,

`Profile user activity by categorizing them based on their last login and highlighting users needing outreach.
    
SELECT
"Username",
"LastLoginDate",
CASE
    WHEN "LastLoginDate" >= NOW() - INTERVAL '30 days' THEN 'Active'
    WHEN "LastLoginDate" < NOW() - INTERVAL '30 days' AND "LastLoginDate" >= NOW() - INTERVAL '90 days' THEN 'Needs Engagement'
    ELSE 'At Risk'
END AS EngagementStatus
FROM
mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."User"
ORDER BY "LastLoginDate";
`,

`Get the total number of opportunities associated with a given account ID.
    
SELECT COUNT(*)
FROM mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."Opportunity"
WHERE "AccountId" = '<Account_ID>';
`,

`Find the total number of cases opened by a specific contact ID in the last year.
    
SELECT COUNT(*)
FROM mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."Case"
WHERE "ContactId" = '<Contact_ID>' AND "CreatedDate" > CURRENT_DATE - INTERVAL '1 year';
`,


`Determine the latest activity date for a contact based on their email address.
    
SELECT "LastActivityDate"
FROM mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."Contact"
WHERE "Email" = '<Contact_Email>';
`,

`Calculate the average deal size for opportunities related to an account identified by its ID.
    
SELECT AVG("Amount")
FROM mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."Opportunity"
WHERE "AccountId" = '<Account_ID>';
`,]

const  array = [
    {
        question: "Identify top-performing campaigns based on the number of opportunities won, using joins and aggregate functions.",
        DDL: `SELECT
    c."Name",
    COUNT(o."Id") AS TotalWonOpportunities,
    SUM(o."Amount") AS TotalWonAmount
    FROM
    mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."Campaign" c
    JOIN
    mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."Opportunity" o ON c."Id" = o."CampaignId"
    WHERE
    o."IsWon" = TRUE
    GROUP BY
    c."Name"
    ORDER BY
    TotalWonOpportunities DESC
    LIMIT 5;`
    },
    {
        question: "Create a view to easily access contact engagement, incorporating time-based categorization and window functions.",
        DDL: `CREATE OR REPLACE VIEW contact_engagement AS
    SELECT
    "Id",
    "Email",
    "LastActivityDate",
    CASE
        WHEN "LastActivityDate" >= NOW() - INTERVAL '30 days' THEN 'Active Recently'
        WHEN "LastActivityDate" < NOW() - INTERVAL '30 days' AND "LastActivityDate" >= NOW() - INTERVAL '90 days' THEN 'Active Previously'
        ELSE 'Inactive'
    END AS EngagementCategory,
    RANK() OVER (PARTITION BY "LastActivityDate"::DATE ORDER BY "LastActivityDate") AS DailyActivityRank
    FROM
    mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."Contact";`
    },
    {
        question: "Analyze opportunity closure rates over time, showcasing date functions, categorization, and advanced statistical aggregation.",
        DDL: `SELECT
    EXTRACT(YEAR FROM "CloseDate") AS Year,
    EXTRACT(MONTH FROM "CloseDate") AS Month,
    COUNT(*) AS TotalOpportunities,
    SUM(CASE WHEN "IsWon" = TRUE THEN 1 ELSE 0 END) AS WonOpportunities,
    (SUM(CASE WHEN "IsWon" = TRUE THEN 1 ELSE 0 END)::FLOAT / COUNT(*)) * 100 AS WinRatePercentage
    FROM
    mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."Opportunity"
    GROUP BY
    Year,
    Month
    ORDER BY
    Year,
    Month;`
    },
    {
        question: "Determine the average case resolution time and categorize cases by priority, showcasing date differences and case statements.",
        DDL: `SELECT
    "Priority",
    AVG("ClosedDate" - "CreatedDate") AS AvgResolutionTimeDays
    FROM
    mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."Case"
    WHERE
    "IsClosed" = TRUE
    GROUP BY
    "Priority";`
    },
    {
        question: "Analyze the usage of email templates, highlighting the most and least popular templates, and introduce a view for easier access.",
        DDL: `CREATE OR REPLACE VIEW email_template_usage AS
    SELECT
    "Name",
    "TimesUsed",
    RANK() OVER (ORDER BY "TimesUsed" DESC) AS PopularityRank,
    CASE
        WHEN "TimesUsed" > 100 THEN 'Highly Used'
        WHEN "TimesUsed" <= 100 AND "TimesUsed" > 10 THEN 'Moderately Used'
        ELSE 'Seldom Used'
    END AS UsageCategory
    FROM
    mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."EmailTemplate";`
    },
    {
        question: "Evaluate product inventory levels, incorporating conditional aggregates to identify low stock products.",
        DDL: `SELECT
    "Family",
    COUNT(*) AS TotalProducts,
    SUM(CASE WHEN "QuantityUnitOfMeasure" < 50 THEN 1 ELSE 0 END) AS LowStockProducts
    FROM
    mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."Product2"
    WHERE
    "IsActive" = TRUE
    GROUP BY
    "Family";`
    },
    {
        question: "Aggregate social media engagement metrics by media type and provide a ranking system for influencers based on follower count.",
        DDL: `SELECT
    "MediaType",
    SUM("Followers") AS TotalFollowers,
    AVG("InfluencerScore") AS AvgInfluencerScore,
    MAX("Followers") AS MaxFollowers,
    (ROW_NUMBER() OVER (ORDER BY SUM("Followers") DESC)) AS MediaRank
    FROM
    mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."SocialPersona"
    GROUP BY
    "MediaType";`
    },
    {
        question: "Analyze task completion rates by month, incorporating time-based grouping and percentage calculations.",
        DDL: `SELECT
    EXTRACT(YEAR FROM "ActivityDate") AS Year,
    EXTRACT(MONTH FROM "ActivityDate") AS Month,
    COUNT(*) AS TotalTasks,
    SUM(CASE WHEN "IsClosed" = TRUE THEN 1 ELSE 0 END) AS CompletedTasks,
    (SUM(CASE WHEN "IsClosed" = TRUE THEN 1 ELSE 0 END)::FLOAT / COUNT(*)) * 100 AS CompletionRate
    FROM
    mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."Task"
    GROUP BY
    Year, Month
    ORDER BY
    Year, Month;`
    },
    {
        question: "Identify the distribution of group types and the average number of members per group type.",
        DDL: `SELECT
    "Type",
    COUNT(*) AS TotalGroups,
    AVG(member_count) AS AvgMembersPerGroup
    FROM
    mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."Group"
    CROSS JOIN LATERAL (
    SELECT COUNT(*) AS member_count
    FROM mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."User"
    WHERE "ManagerId" = mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."Group"."OwnerId"
    ) AS grp_members
    GROUP BY "Type";`
    },
    {
        question: "Create a ranked list of ListView by SObjectType, showcasing those most frequently used.",
        DDL: `SELECT
    "SobjectType",
    "Name",
    RANK() OVER (PARTITION BY "SobjectType" ORDER BY "LastViewedDate" DESC) AS ViewRank
    FROM
    mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."ListView"
    WHERE
    "LastViewedDate" IS NOT NULL;`
    },
    {
        question: "Determine how note engagement varies by creation month and year, using date extraction and filtering for active notes.",
        DDL: `SELECT
    EXTRACT(YEAR FROM "CreatedDate") AS Year,
    EXTRACT(MONTH FROM "CreatedDate") AS Month,
    COUNT(*) AS TotalNotes,
    SUM(CASE WHEN "IsPrivate" = FALSE THEN 1 ELSE 0 END) AS PublicNotes
    FROM
    mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."Note"
    WHERE
    "LastModifiedDate" > CURRENT_DATE - INTERVAL '1 year'
    GROUP BY Year, Month
    ORDER BY Year, Month;`
    },
    {
        question: "Aggregate reports by format type and calculate average run time for each format.",
        DDL: `SELECT
    "Format",
    COUNT(*) AS TotalReports,
    AVG(EXTRACT(EPOCH FROM ("LastRunDate" - "CreatedDate")) / 60) AS AvgRunTimeMinutes
    FROM
    mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."Report"
    GROUP BY "Format";`
    },
    {
        question: "Profile user activity by categorizing them based on their last login and highlighting users needing outreach.",
        DDL: `SELECT
    "Username",
    "LastLoginDate",
    CASE
        WHEN "LastLoginDate" >= NOW() - INTERVAL '30 days' THEN 'Active'
        WHEN "LastLoginDate" < NOW() - INTERVAL '30 days' AND "LastLoginDate" >= NOW() - INTERVAL '90 days' THEN 'Needs Engagement'
        ELSE 'At Risk'
    END AS EngagementStatus
    FROM
    mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."User"
    ORDER BY "LastLoginDate";`
    },
    {
        question: "Get the total number of opportunities associated with a given account ID.",
        DDL: `SELECT COUNT(*)
    FROM mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."Opportunity"
    WHERE "AccountId" = '<Account_ID>';`
    },
    {
        question: "Find the total number of cases opened by a specific contact ID in the last year.",
        DDL: `SELECT COUNT(*)
    FROM mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."Case"
    WHERE "ContactId" = '<Contact_ID>' AND "CreatedDate" > CURRENT_DATE - INTERVAL '1 year';`
    },
    {
        question: "Determine the latest activity date for a contact based on their email address.",
        DDL: `SELECT "LastActivityDate"
    FROM mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."Contact"
    WHERE "Email" = '<Contact_Email>';`
    },
    {
        question: "Calculate the average deal size for opportunities related to an account identified by its ID.",
        DDL: `SELECT AVG("Amount")
    FROM mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a."Opportunity"
    WHERE "AccountId" = '<Account_ID>';`
    },
];

console.log(array);

let type = ['SCHEMA','RELATIONS', 'SQL', 'FINETUNE']
let test = ['Testing azure openai']
async function makeApiRequests(arr) {
    // arr.forEach(async (ele, i) => {
        // let i = 0
        try {
            console.log("...", arr.length)
            const response = await axios.post(`${HOST}/api/v1/train-model`, {
                "documentation": arr,
                "modelName": "sampleModel",
                "trainingDataType":type[0]
                // // "trainingDataType": "RELATIONS"
                // "trainingDataType": "SQL"
            }, {
                headers: {
                    "x-api-key": "3fdce849ecf90acb90e32f6776ea2c80b0f5c676"
                }
            });
            console.log("🚀 ~ //arr.forEach ~ response:", response)
        } catch (error) {
            console.log("🚀 ~ makeApiRequests ~ error:", error)
            
        }

    // })
    console.log("DONE")
}

 makeApiRequests(arr);

