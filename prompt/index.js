
function generateSQLPrompt(schema, relations, sql) {
    // Place your logic here to generate the final SQL string
    const SQLPrompt = `
    The user provides a question and you provide SQL. You will only respond with SQL code and not with any explanations.

    Respond with only SQL code. Do not answer with any explanations -- just the code. No any markdown response. Do not create ay destructive query.

    You may use the following SCHEMA, RELATIONS, Sample SQL as a reference for what tables. relation, and example sql might be available. Use responses to past questions also to guide you:
    SCHEMA: ${schema}, 
    RELATIONS: ${relations}, 
    Example Questions and Sql: ${sql}
        
    This is a Postgres database
    `;
    return SQLPrompt;
}


let sample = [
    {
        "role": "user",
        "content": "Compare the quarterly sales performance this year to the same quarters last year."
    },
    {
        "role": "assistant",
        "content": "WITH QuarterlySales AS (\n  SELECT\n    EXTRACT(YEAR FROM \"CloseDate\") AS Year,\n    EXTRACT(QUARTER FROM \"CloseDate\") AS Quarter,\n    SUM(\"Amount\") AS TotalSales\n  FROM\n    mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a.\"Opportunity\"\n  WHERE\n    \"IsWon\" = TRUE AND\n    (\"CloseDate\" >= CURRENT_DATE - INTERVAL '2 years')\n  GROUP BY\n    Year, Quarter\n),\nYearComparison AS (\n  SELECT\n    Current.Year,\n    Current.Quarter,\n    Current.TotalSales AS ThisYearSales,\n    Previous.TotalSales AS LastYearSales,\n    (Current.TotalSales - Previous.TotalSales) / Previous.TotalSales * 100 AS SalesGrowthPercentage\n  FROM\n    QuarterlySales Current\n  JOIN\n    QuarterlySales Previous ON Current.Quarter = Previous.Quarter AND Current.Year = Previous.Year + 1\n)\nSELECT\n  Year,\n  Quarter,\n  ThisYearSales,\n  LastYearSales,\n  SalesGrowthPercentage\nFROM\n  YearComparison\nORDER BY\n  Year,\n  Quarter;"
    },
    {
        "role": "user",
        "content": "How many opportunities are won on average by each sales rep per quarter?"
    },
    {
        "role": "assistant",
        "content": "SELECT\n    \"OwnerId\",\n    EXTRACT(YEAR FROM \"CloseDate\") AS Year,\n    EXTRACT(QUARTER FROM \"CloseDate\") AS Quarter,\n    COUNT(*) AS TotalWonOpportunities,\n    COUNT(*) / COUNT(DISTINCT EXTRACT(QUARTER FROM \"CloseDate\")) AS AverageWonOpportunitiesPerQuarter\nFROM\n    mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a.\"Opportunity\"\nWHERE\n    \"IsWon\" = TRUE\nGROUP BY\n    \"OwnerId\",\n    Year,\n    Quarter;"
    },
    {
        "role": "user",
        "content": "What is the annual growth rate of new accounts created over the past 5 years?"
    },
    {
        "role": "assistant",
        "content": "WITH AccountCreation AS (\n  SELECT\n    EXTRACT(YEAR FROM \"CreatedDate\") AS Year,\n    COUNT(*) AS TotalAccounts\n  FROM\n    mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a.\"Account\"\n  WHERE\n    \"CreatedDate\" >= CURRENT_DATE - INTERVAL '5 years'\n  GROUP BY\n    Year\n),\nYearOverYearGrowth AS (\n  SELECT\n    Year,\n    TotalAccounts,\n    LAG(TotalAccounts) OVER (ORDER BY Year) AS PreviousYearAccounts,\n    (TotalAccounts - LAG(TotalAccounts) OVER (ORDER BY Year))::FLOAT / LAG(TotalAccounts) OVER (ORDER BY Year) * 100 AS GrowthRate\n  FROM\n    AccountCreation\n)\nSELECT\n  Year,\n  TotalAccounts,\n  GrowthRate\nFROM\n  YearOverYearGrowth\nWHERE\n  PreviousYearAccounts IS NOT NULL;"
    },
    {
        "role": "user",
        "content": "Which top 5 accounts have shown the most significant increase in revenue year-over-year?"
    },
    {
        "role": "assistant",
        "content": "WITH AnnualRevenue AS (\n  SELECT\n    \"AccountId\",\n    EXTRACT(YEAR FROM \"CloseDate\") AS Year,\n    SUM(\"Amount\") AS TotalRevenue\n  FROM\n    mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a.\"Opportunity\"\n  WHERE\n    \"IsWon\" = TRUE\n  GROUP BY\n    \"AccountId\", Year\n),\nYearOverYearGrowth AS (\n  SELECT\n    AR.\"AccountId\",\n    AR.Year,\n    AR.TotalRevenue,\n    LAG(AR.TotalRevenue) OVER (PARTITION BY AR.\"AccountId\" ORDER BY AR.Year) AS PreviousYearRevenue,\n    (AR.TotalRevenue - LAG(AR.TotalRevenue) OVER (PARTITION BY AR.\"AccountId\" ORDER BY AR.Year)) / LAG(AR.TotalRevenue) OVER (PARTITION BY AR.\"AccountId\" ORDER BY AR.Year) * 100 AS RevenueGrowthPercentage\n  FROM\n    AnnualRevenue AR\n)\nSELECT\n  \"AccountId\",\n  Year,\n  TotalRevenue,\n  PreviousYearRevenue,\n  RevenueGrowthPercentage\nFROM\n  YearOverYearGrowth\nWHERE\n  RevenueGrowthPercentage IS NOT NULL\nORDER BY\n  RevenueGrowthPercentage DESC\nLIMIT 5;"
    },
    {
        "role": "user",
        "content": "Percentage change in revenue per account compared to the previous year."
    },
    {
        "role": "assistant",
        "content": "WITH RevenuePerYear AS (\n  SELECT\n    \"AccountId\",\n    EXTRACT(YEAR FROM \"CloseDate\") AS Year,\n    SUM(\"Amount\") AS TotalRevenue\n  FROM\n    mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a.\"Opportunity\"\n  WHERE\n    \"IsWon\" = TRUE\n  GROUP BY\n    \"AccountId\", Year\n),\nRevenueChange AS (\n  SELECT\n    a.\"AccountId\",\n    a.Year,\n    a.TotalRevenue AS CurrentYearRevenue,\n    LAG(a.TotalRevenue) OVER (PARTITION BY a.\"AccountId\" ORDER BY a.Year) AS PreviousYearRevenue\n  FROM\n    RevenuePerYear a\n)\nSELECT\n  \"AccountId\",\n  Year,\n  CurrentYearRevenue,\n  PreviousYearRevenue,\n  ((CurrentYearRevenue - PreviousYearRevenue) / PreviousYearRevenue) * 100 AS PercentageChange\nFROM\n  RevenueChange\nWHERE\n  PreviousYearRevenue IS NOT NULL;\n"
    },
    {
        "role": "user",
        "content": "What percentage of leads converted into opportunities last quarter?"
    },
    {
        "role": "assistant",
        "content": "SELECT\n    COUNT(*) AS TotalLeads,\n    SUM(CASE WHEN \"IsConverted\" = TRUE THEN 1 ELSE 0 END) AS ConvertedLeads,\n    (SUM(CASE WHEN \"IsConverted\" = TRUE THEN 1 ELSE 0 END)::FLOAT / COUNT(*)) * 100 AS ConversionRate\nFROM\n    mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a.\"Lead\"\nWHERE\n    EXTRACT(YEAR FROM \"CreatedDate\") = EXTRACT(YEAR FROM CURRENT_DATE) AND\n    EXTRACT(QUARTER FROM \"CreatedDate\") = EXTRACT(QUARTER FROM CURRENT_DATE) - 1;"
    },
    {
        "role": "user",
        "content": "What is the distribution of account types within our CRM and their average annual revenue?"
    },
    {
        "role": "assistant",
        "content": "SELECT\n    \"Type\",\n    COUNT(*) AS TotalAccounts,\n    AVG(\"AnnualRevenue\") AS AverageAnnualRevenue\nFROM\n    mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a.\"Account\"\nGROUP BY\n    \"Type\";"
    },
    {
        "role": "user",
        "content": "Determine the average lead response time by the sales team."
    },
    {
        "role": "assistant",
        "content": "SELECT\n    AVG(\"LastActivityDate\" - \"CreatedDate\") AS AvgLeadResponseTimeDays\nFROM\n    mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a.\"Lead\";"
    },
    {
        "role": "user",
        "content": "pick a random account and explain me the health of that account from revenue standpoint ?"
    },
    {
        "role": "assistant",
        "content": "SELECT\n    \"Name\",\n    \"AnnualRevenue\",\n    CASE\n        WHEN \"AnnualRevenue\" > 10000000 THEN 'Healthy - High revenue indicating strong financial health.'\n        WHEN \"AnnualRevenue\" BETWEEN 1000000 AND 10000000 THEN 'Moderate - Good revenue but there is room for growth.'\n        WHEN \"AnnualRevenue\" BETWEEN 500000 AND 999999 THEN 'Fair - Revenue is modest, suggesting potential vulnerabilities.'\n        ELSE 'At Risk - Low revenue indicating potential financial challenges.'\n    END AS \"RevenueHealth\"\nFROM\n    mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a.\"Account\"\nORDER BY\n    RANDOM()\nLIMIT 1;"
    },
    {
        "role": "user",
        "content": "How does user activity within the CRM correlate with sales performance?"
    },
    {
        "role": "assistant",
        "content": "WITH UserActivity AS (\n  SELECT\n    \"CreatedById\",\n    COUNT(*) AS TotalActivities\n  FROM\n    (\n      SELECT \"CreatedById\" FROM mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a.\"Task\"\n      UNION ALL\n      SELECT \"CreatedById\" FROM mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a.\"Event\"\n    ) AS Activities\n  GROUP BY\n    \"CreatedById\"\n),\nSalesPerformance AS (\n  SELECT\n    \"CreatedById\",\n    SUM(\"Amount\") AS TotalSales\n  FROM\n    mig_14_4ccd6956_f0a9_4b22_b6e0_c203f2ba4a8a.\"Opportunity\"\n  WHERE\n    \"IsWon\" = TRUE\n  GROUP BY\n    \"CreatedById\"\n)\nSELECT\n  ua.\"CreatedById\",\n  ua.TotalActivities,\n  sp.TotalSales,\n  (sp.TotalSales / NULLIF(ua.TotalActivities, 0)) AS SalesPerActivity\nFROM\n  UserActivity ua\nLEFT JOIN\n  SalesPerformance sp ON ua.\"CreatedById\" = sp.\"CreatedById\"\nORDER BY\n  SalesPerActivity DESC;"
    }
]

function createChatMessages(sysprompt, userQuestion, relatedSql) {
    let messages = []

    relatedSql.forEach(ele => {
        messages.push({ role: "user", content: ele.question})
        messages.push({ role: "assistant", content: ele.content})
    })
    return [
        {
            "role": "system",
            "content": sysprompt
        },
        ...messages,
        {
            "role": "user",
            "content": userQuestion
        }
        ,
        // ...messages
    ]

}

// Export the function
module.exports = {
    createChatMessages,
    generateSQLPrompt
};