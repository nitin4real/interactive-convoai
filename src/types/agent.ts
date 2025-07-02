export enum EAgentRunningStatus {
  DEFAULT = 'DEFAULT',
  RECONNECTING = 'RECONNECTING',
  LISTENING = 'LISTENING',
  SPEAKING = 'SPEAKING'
} 

export interface IMessage {
  type: 'user.transcription' | 'assistant.transcription' | 'question' | 'concept_image';
  text: string;
  turn_id?: number;
  questionData?: QuestionData
  imageData?: ImageMetaData
}


interface QuestionData {
  type: 'question',
  questionDescription: string,
  options: string[]
}
interface ImageMetaData {
  type: 'concept_image',
  conceptName: string,
  imageUrl: string,
  imageDescription: string
}