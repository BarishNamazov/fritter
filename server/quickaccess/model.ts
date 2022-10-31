import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

export type QuickAccess = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  entries: Array<{name: string; url: string}>;
  dateUpdated: Date;
};

const QuickAccessSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  entries: {
    type: [{
      name: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      }
    }],
    _id: false,
    required: true,
    default: [{name: 'Fritter Home', url: 'fritter.com'}]
  },
  dateUpdated: {
    type: Date,
    required: true
  }
}, {
  toObject: {versionKey: false}
});

QuickAccessSchema.index({userId: 1});

const QuickAccessModel = model<QuickAccess>('QuickAccess', QuickAccessSchema);
export default QuickAccessModel;
