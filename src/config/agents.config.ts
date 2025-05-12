
export interface StartAgentRequest {
  channelName: string;
  languageCode: string;
}

export interface StopAgentRequest {}

export interface AgentLanguage {
  name: string;
  isoCode: string;
}

export interface AgentTile {
  id: string;
  name: string;
  title: string;
  description: string;
  features: string[];
  languages: AgentLanguage[];
}
