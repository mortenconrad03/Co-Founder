/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { supabase } from './supabase'

export const db = {
  async saveOnboarding(userId: string, data: Record<string, any>) {
    const allowedKeys = ["vorname","nachname","pitch","problem","zielgruppe","phase","bundesland","branche","kapitalbedarf","teamgroesse","investoren","foerderungen","businessplan","finanzplan","konkurrenz","preis","rechtsform","ziele","onboarding_complete"];
    const row: Record<string, any> = { onboarding_complete: true, updated_at: new Date().toISOString() };
    allowedKeys.forEach(function(k) { if (data[k] !== undefined) row[k] = data[k]; });
    const { error } = await supabase.from("profiles").update(row).eq("id", userId);
    if (error) console.error("saveOnboarding error:", error);
    return !error;
  },

  async getOnboarding(userId: string) {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (error && error.code !== "PGRST116") console.error("getOnboarding error:", error);
    return data;
  },

  async getCompletedTasks(userId: string) {
    const { data, error } = await supabase.from("roadmap_progress").select("task_id").eq("user_id", userId);
    if (error) console.error("getCompletedTasks error:", error);
    const map: Record<string, boolean> = {};
    if (data) data.forEach(function(r: any) { map[r.task_id] = true; });
    return map;
  },

  async toggleTask(userId: string, taskId: string, completed: boolean) {
    if (completed) {
      const { error } = await supabase.from("roadmap_progress").upsert({ user_id: userId, task_id: taskId }, { onConflict: "user_id,task_id" });
      if (error) console.error("toggleTask insert error:", error);
    } else {
      const { error } = await supabase.from("roadmap_progress").delete().eq("user_id", userId).eq("task_id", taskId);
      if (error) console.error("toggleTask delete error:", error);
    }
  },

  async saveAiRoadmap(userId: string, tasks: any[]) {
    await supabase.from("ai_roadmap").delete().eq("user_id", userId);
    const rows = tasks.map(function(t: any, i: number) {
      return { user_id: userId, task_index: i, task_id: t.id, week: t.week, category: t.category, title: t.title, description: t.description, priority: t.priority, effort: t.effort, link: t.link };
    });
    const { error } = await supabase.from("ai_roadmap").insert(rows);
    if (error) console.error("saveAiRoadmap error:", error);
    return !error;
  },

  async getAiRoadmap(userId: string) {
    const { data, error } = await supabase.from("ai_roadmap").select("*").eq("user_id", userId).order("task_index");
    if (error) console.error("getAiRoadmap error:", error);
    if (data && data.length > 0) return data.map(function(r: any) { return { id: r.task_id, week: r.week, category: r.category, title: r.title, description: r.description, priority: r.priority, effort: r.effort, link: r.link }; });
    return null;
  },

  async saveCustomTask(userId: string, task: any) {
    const { data, error } = await supabase.from("custom_tasks").insert({
      user_id: userId, task_id: task.id, week: task.week, title: task.title, description: task.description || ""
    }).select().single();
    if (error) console.error("saveCustomTask error:", error);
    return data;
  },

  async getCustomTasks(userId: string) {
    const { data, error } = await supabase.from("custom_tasks").select("*").eq("user_id", userId).order("created_at");
    if (error) console.error("getCustomTasks error:", error);
    if (data) return data.map(function(r: any) { return { id: r.task_id, week: r.week, title: r.title, description: r.description, priority: "mittel", effort: "", link: "/dashboard", isCustom: true }; });
    return [];
  },

  async deleteCustomTask(userId: string, taskId: string) {
    const { error } = await supabase.from("custom_tasks").delete().eq("user_id", userId).eq("task_id", taskId);
    if (error) console.error("deleteCustomTask error:", error);
    await supabase.from("roadmap_progress").delete().eq("user_id", userId).eq("task_id", taskId);
    return !error;
  },

  async uploadDocument(userId: string, file: File, docTypeId: string) {
    const path = userId + "/" + Date.now() + "_" + file.name;
    const { error: uploadError } = await supabase.storage.from("documents").upload(path, file);
    if (uploadError) { console.error("upload error:", uploadError); return null; }
    const { error: dbError } = await supabase.from("documents").insert({
      user_id: userId, doc_type_id: docTypeId || "custom",
      file_name: file.name, file_size: file.size, file_path: path
    });
    if (dbError) console.error("doc insert error:", dbError);
    return path;
  },

  async getDocuments(userId: string) {
    const { data, error } = await supabase.from("documents").select("*").eq("user_id", userId).order("uploaded_at", { ascending: false });
    if (error) console.error("getDocuments error:", error);
    return data || [];
  },

  async deleteDocument(userId: string, docId: string, storagePath: string) {
    await supabase.storage.from("documents").remove([storagePath]);
    const { error } = await supabase.from("documents").delete().eq("id", docId).eq("user_id", userId);
    if (error) console.error("deleteDocument error:", error);
  },

  async getDocumentUrl(storagePath: string) {
    const { data } = await supabase.storage.from("documents").createSignedUrl(storagePath, 3600);
    return data?.signedUrl;
  },

  async getFoerderprogramme(onboardingData: any) {
    const query = supabase.from("foerderprogramme").select("*").eq("aktiv", true);
    const { data, error } = await query;
    if (error) console.error("getFoerderprogramme error:", error);
    if (!data || !onboardingData) return data || [];
    return data.map(function(p: any) {
      let score = 0;
      if (p.phasen && p.phasen.length > 0 && p.phasen.includes(onboardingData.phase)) score += 3;
      if (p.bundeslaender && p.bundeslaender.length > 0 && p.bundeslaender.includes(onboardingData.bundesland)) score += 2;
      else if (!p.bundeslaender || p.bundeslaender.length === 0) score += 1;
      if (p.branchen && p.branchen.length > 0 && p.branchen.includes(onboardingData.branche)) score += 2;
      else if (!p.branchen || p.branchen.length === 0) score += 1;
      return Object.assign({}, p, { relevance: score });
    }).sort(function(a: any, b: any) { return b.relevance - a.relevance; });
  },

  async saveQuizResult(userId: string, answers: any, resultKey: string, scores: any, confidence: any) {
    const { error } = await supabase.from("quiz_results").insert({
      user_id: userId, answers: answers, result_key: resultKey, scores: scores, confidence: confidence
    });
    if (error) console.error("saveQuizResult error:", error);
    return !error;
  },

  async saveRechtsformAnalysis(userId: string, data: any) {
    const { error } = await supabase.from("profiles").update({ rechtsform_ai_analysis: JSON.stringify(data) }).eq("id", userId);
    if (error) console.error("saveRechtsformAnalysis error:", error);
    return !error;
  },

  async getRechtsformAnalysis(userId: string) {
    const { data, error } = await supabase.from("profiles").select("rechtsform_ai_analysis").eq("id", userId).single();
    if (error || !data || !data.rechtsform_ai_analysis) return null;
    return typeof data.rechtsform_ai_analysis === "string" ? JSON.parse(data.rechtsform_ai_analysis) : data.rechtsform_ai_analysis;
  },

  async saveCheckin(userId: string, weekStart: string, userText: string, aiFeedback: string) {
    const { error } = await supabase.from("cockpit_checkins").upsert({ user_id:userId, week_start:weekStart, user_text:userText, ai_feedback:aiFeedback }, { onConflict:"user_id,week_start" });
    if (error) console.error("saveCheckin error:", error);
  },

  async getCheckins(userId: string, limit?: number) {
    const { data, error } = await supabase.from("cockpit_checkins").select("*").eq("user_id", userId).order("week_start", {ascending:false}).limit(limit||10);
    if (error) console.error("getCheckins error:", error);
    return data || [];
  },

  async saveKPI(userId: string, period: string, data: any) {
    const { error } = await supabase.from("cockpit_kpis").upsert({ user_id:userId, period:period, period_type:"weekly", umsatz:data.umsatz||0, kunden:data.kunden||0, ausgaben:data.ausgaben||0, leads:data.leads||0 }, { onConflict:"user_id,period,period_type" });
    if (error) console.error("saveKPI error:", error);
  },

  async getKPIs(userId: string, limit?: number) {
    const { data, error } = await supabase.from("cockpit_kpis").select("*").eq("user_id", userId).order("period", {ascending:true}).limit(limit||52);
    if (error) console.error("getKPIs error:", error);
    return data || [];
  },

  async getDeadlines(userId: string) {
    const { data, error } = await supabase.from("cockpit_deadlines").select("*").eq("user_id", userId).order("due_date", {ascending:true});
    if (error) console.error("getDeadlines error:", error);
    return data || [];
  },

  async saveDeadlines(userId: string, deadlines: any[]) {
    const rows = deadlines.map(function(d: any) { return Object.assign({}, d, { user_id:userId }); });
    const { error } = await supabase.from("cockpit_deadlines").insert(rows);
    if (error) console.error("saveDeadlines error:", error);
  },

  async toggleDeadline(userId: string, deadlineId: string, completed: boolean) {
    const { error } = await supabase.from("cockpit_deadlines").update({ completed:completed }).eq("id", deadlineId).eq("user_id", userId);
    if (error) console.error("toggleDeadline error:", error);
  }
};
