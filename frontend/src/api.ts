import { supabase } from './lib/supabase';

export interface IExperience {
    id: string;
    title: string;
    company_name: string;
    start_date: string;
    timeframe: string;
    location: string;
    description: string[];
    company_url: string | null;
}

export interface IPortfolioItem {
    id: string;
    title: string;
    description: string;
    image_url: string;
    icon_urls: string[];
}

export interface ISkill {
    id: string;
    title: string;
    icon_url: string;
}

export async function fetchExperiences(): Promise<IExperience[]> {
    const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('start_date', { ascending: false });

    if (error) throw new Error(error.message);
    return data as IExperience[];
}

export async function fetchPortfolioItems(): Promise<IPortfolioItem[]> {
    const { data, error } = await supabase
        .from('portfolio_items')
        .select('*');

    if (error) throw new Error(error.message);
    return data as IPortfolioItem[];
}

export async function fetchSkills(): Promise<ISkill[]> {
    const { data, error } = await supabase
        .from('skills')
        .select('*');

    if (error) throw new Error(error.message);
    return data as ISkill[];
}
