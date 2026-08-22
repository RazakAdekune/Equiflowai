/* ═══════════════════════════════════════════════════════════
   EquiFlow — Supabase Client & Query Helpers
   Include this file in every HTML page AFTER the Supabase CDN
═══════════════════════════════════════════════════════════ */

const SUPA_URL = 'https://jurtnfffqyyohtvrhdrc.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1cnRuZmZmcXl5b2h0dnJoZHJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3NTMwNzIsImV4cCI6MjA5OTMyOTA3Mn0.Sdn0Do6UeIqOUow9OKv5kZExbEKjQR8iwZGhHMbRrPI';

const _db = window.supabase.createClient(SUPA_URL, SUPA_KEY);

/* ── ID generator ──────────────────────────────────────────── */
function genId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

/* ════════════════════════════════════════════════════════════
   USERS
════════════════════════════════════════════════════════════ */
async function dbGetUser(id) {
  const { data, error } = await _db.from('users').select('*').eq('id', id).single();
  if (error) { console.error('dbGetUser', error); return null; }
  return data;
}

async function dbGetUserByEmail(email) {
  const { data } = await _db.from('users').select('*').ilike('email', email.trim()).maybeSingle();
  return data || null;
}

async function dbGetAllUsers() {
  const { data, error } = await _db.from('users').select('*').order('created_at', { ascending: false });
  if (error) { console.error('dbGetAllUsers', error); return []; }
  return data || [];
}

async function dbCreateUser(user) {
  const { data, error } = await _db.from('users').insert([user]).select().single();
  if (error) { console.error('dbCreateUser', error); return null; }
  return data;
}

async function dbUpdateUser(id, fields) {
  const { error } = await _db.from('users').update(fields).eq('id', id);
  if (error) console.error('dbUpdateUser', error);
}

/* ════════════════════════════════════════════════════════════
   WAITLIST
════════════════════════════════════════════════════════════ */
async function dbGetWaitlist() {
  const { data, error } = await _db.from('waitlist').select('*').order('joined_at', { ascending: false });
  if (error) { console.error('dbGetWaitlist', error); return []; }
  return data || [];
}

async function dbGetWaitlistByInviteCode(code) {
  const { data } = await _db.from('waitlist').select('*').ilike('invite_code', code).maybeSingle();
  return data || null;
}

async function dbWaitlistEmailExists(email) {
  const { data } = await _db.from('waitlist').select('id').ilike('email', email.trim()).maybeSingle();
  return !!data;
}

async function dbAddToWaitlist(entry) {
  const { data, error } = await _db.from('waitlist').insert([entry]).select().single();
  if (error) { console.error('dbAddToWaitlist', error); return null; }
  return data;
}

async function dbUpdateWaitlist(id, fields) {
  const { error } = await _db.from('waitlist').update(fields).eq('id', id);
  if (error) console.error('dbUpdateWaitlist', error);
}

/* ════════════════════════════════════════════════════════════
   DEPOSITS
════════════════════════════════════════════════════════════ */
async function dbGetAllDeposits() {
  const { data, error } = await _db.from('deposits').select('*').order('submitted_at', { ascending: false });
  if (error) { console.error('dbGetAllDeposits', error); return []; }
  return data || [];
}

async function dbGetDepositsByUser(userId) {
  const { data, error } = await _db.from('deposits').select('*').eq('user_id', userId).order('submitted_at', { ascending: false });
  if (error) { console.error('dbGetDepositsByUser', error); return []; }
  return data || [];
}

async function dbCreateDeposit(deposit) {
  const { data, error } = await _db.from('deposits').insert([deposit]).select().single();
  if (error) { console.error('dbCreateDeposit', error); return null; }
  return data;
}

async function dbUpdateDeposit(id, fields) {
  const { error } = await _db.from('deposits').update(fields).eq('id', id);
  if (error) console.error('dbUpdateDeposit', error);
}

/* ════════════════════════════════════════════════════════════
   WITHDRAWALS
════════════════════════════════════════════════════════════ */
async function dbGetAllWithdrawals() {
  const { data, error } = await _db.from('withdrawals').select('*').order('requested_at', { ascending: false });
  if (error) { console.error('dbGetAllWithdrawals', error); return []; }
  return data || [];
}

async function dbGetWithdrawalsByUser(userId) {
  const { data, error } = await _db.from('withdrawals').select('*').eq('user_id', userId).order('requested_at', { ascending: false });
  if (error) { console.error('dbGetWithdrawalsByUser', error); return []; }
  return data || [];
}

async function dbCreateWithdrawal(withdrawal) {
  const { data, error } = await _db.from('withdrawals').insert([withdrawal]).select().single();
  if (error) { console.error('dbCreateWithdrawal', error); return null; }
  return data;
}

async function dbUpdateWithdrawal(id, fields) {
  const { error } = await _db.from('withdrawals').update(fields).eq('id', id);
  if (error) console.error('dbUpdateWithdrawal', error);
}

/* ════════════════════════════════════════════════════════════
   ACTIVITY LOG
════════════════════════════════════════════════════════════ */
async function dbGetActivityLog() {
  const { data, error } = await _db.from('activity_log').select('*').order('created_at', { ascending: false }).limit(100);
  if (error) { console.error('dbGetActivityLog', error); return []; }
  return data || [];
}

async function dbAddLog(type, message, userId, amount) {
  const entry = {
    id:         genId(),
    type:       type,
    message:    message || '',
    user_id:    userId  || null,
    amount:     amount  || null,
    created_at: new Date().toISOString()
  };
  const { error } = await _db.from('activity_log').insert([entry]);
  if (error) console.error('dbAddLog', error);
}

async function dbClearLog() {
  await _db.from('activity_log').delete().neq('id', '___none___');
}

/* ════════════════════════════════════════════════════════════
   OPP INTERESTS
════════════════════════════════════════════════════════════ */
async function dbAddOppInterest(userId, oppName) {
  const { error } = await _db.from('opp_interests').insert([{
    id:         genId(),
    user_id:    userId,
    opp_name:   oppName,
    created_at: new Date().toISOString()
  }]);
  if (error) console.error('dbAddOppInterest', error);
}

/* ════════════════════════════════════════════════════════════
   REAL-TIME — replaces window storage event listener
   Usage: dbListen('withdrawals', callback)
════════════════════════════════════════════════════════════ */
function dbListen(table, callback) {
  return _db.channel('ef_rt_' + table)
    .on('postgres_changes', { event: '*', schema: 'public', table: table }, callback)
    .subscribe();
}
