export interface IExperience {
    _id: string;
    title: string;
    companyName: string;
    startDate: string;
    timeframe: string;
    location: string;
    description: string[];
    companyURL: string;
}

export async function fetchExperiences(): Promise<IExperience[]> {
    const res = await fetch('/api/experience');
    if (!res.ok) throw new Error(`Failed to fetch experiences: ${res.status}`);
    return res.json();
}
