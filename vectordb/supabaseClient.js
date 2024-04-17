// import { createClient } from "@supabase/supabase-js";
const { createClient } = require('@supabase/supabase-js');



// Staging
// export const supabaseClient = createClient(
//   "https://kpvoelbnsngrdlmzcshm.supabase.co",
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtwdm9lbGJuc25ncmRsbXpjc2htIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODEyMTI2NzksImV4cCI6MTk5Njc4ODY3OX0.MO_X5h93KPoGcA7yv8A22hvv5gMRevQU-1tiTxYZKeg"
// );

// production
// @ts-ignore
const supabaseClient = createClient(
  // @ts-ignore
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET
);


module.exports = {
    supabaseClient
};
// pdfgpt2023! - database pw
// SqlAgent
// sqlAgent2024!
// https://gxdevgkubcygeqaqsazw.supabase.co