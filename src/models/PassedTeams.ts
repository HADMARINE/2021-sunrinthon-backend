import { model, Schema, Document, HookNextFunction, models } from 'mongoose';
import error from '@error/ErrorDictionary';

export interface PassedTeamsInterface {
  name: string;
  field: '게임' | '생활' | string;
}

const PassedTeamsSchema: Schema = new Schema({
  name: { type: String, required: true },
  field: { type: String, required: true },
});

export interface PassedTeamsDocument extends Document, PassedTeamsInterface {
  // Add Methods here
}

// PassedTeamsSchema.methods.~~

PassedTeamsSchema.pre('save', function (next: HookNextFunction): void {
  const doc = this as PassedTeamsDocument;
  models.PassedTeams.findOne(
    {
      $or: [{ name: doc.name, field: doc.field }],
    },
    function (err: Error, site: PassedTeamsDocument) {
      if (site) next(error.db.exists());
      if (err) next(err);
      next();
    },
  );
});

const PassedTeams = model<PassedTeamsDocument>(
  'PassedTeams',
  PassedTeamsSchema,
);

export default PassedTeams;
