import { PageHeader } from '../../../components/PageHeader';
import { QuestBoard } from '../components/QuestBoard';

export const QuestsPage = () => (
  <div>
    <PageHeader title="Quests" subtitle="Tägliche & wöchentliche Ziele" back />
    <div className="px-5 py-4">
      <QuestBoard />
    </div>
  </div>
);
