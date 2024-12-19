import { RecursivePartial } from "@/types/utilTypes";
import {
  Prisma,
  SelectOption,
  Answer,
  SelectOption,
  CollectionDataDate,
  CollectionDataFloat,
  CollectionDataInt,
  CollectionDataString,
} from "@prisma/client";

export type FullResponse = Prisma.ResponseGetPayload<{
  include: {
    answers: {
      include: {
        answerSelect: true;
        answerCollection: {
          include: {
            collectionDataDate: true;
            collectionDataFloat: true;
            collectionDataInt: true;
            collectionDataString: true;
          };
        };
        question: {
          include: { defaultAnswerSelectOptions: true; selectOptions: true };
        };
      };
    };
    user: { include: { organization: true; subOrganizations: true } };
    masterData: {
      include: {
        answers: {
          include: {
            answerCollection: {
              include: {
                collectionDataDate: true;
                collectionDataFloat: true;
                collectionDataInt: true;
                collectionDataString: true;
              };
            };
            answerSelect: true;
          };
        };
        masterDataType: {
          include: { dataFields: { include: { selectOptions: true } } };
        };
      };
    };
    family: {
      include: {
        caregivers: true;
        children: true;
        comingFrom: true;
        createdBy: {
          include: { organization: true; subOrganizations: true };
        };
      };
    };
    child: true;
    caregiver: true;
  };
}>;

export type FullQuestion = Prisma.QuestionGetPayload<{
  include: { selectOptions: true; defaultAnswerSelectOptions: true };
}>;

export type FullFamily = Prisma.FamilyGetPayload<{
  include: {
    caregivers: true;
    children: true;
    comingFrom: true;
    createdBy: { include: { organization: true; subOrganizations: true } };
  };
}>;

export type FullSurvey = Prisma.SurveyGetPayload<{
  include: {
    questions: {
      include: { selectOptions: true; defaultAnswerSelectOptions: true };
    };
    masterDataType: {
      include: {
        dataFields: { include: { selectOptions: true } };
        organization: true;
      };
    };
  };
}>;

export type FullUser = Prisma.UserGetPayload<{
  include: { organization: true; subOrganizations: true };
}>;

export type FullSurveyWithResponses = Prisma.SurveyGetPayload<{
  include: {
    questions: {
      include: { selectOptions: true; defaultAnswerSelectOptions: true };
    };
    responses: {
      include: {
        survey: {
          include: {
            questions: {
              include: {
                selectOptions: true;
                defaultAnswerSelectOptions: true;
              };
            };
          };
        };
        answers: {
          include: {
            answerSelect: true;
            question: {
              include: {
                selectOptions: true;
                defaultAnswerSelectOptions: true;
              };
            };
          };
        };
        masterData: {
          include: {
            answers: {
              include: {
                answerCollection: {
                  include: {
                    collectionDataDate: true;
                    collectionDataFloat: true;
                    collectionDataInt: true;
                    collectionDataString: true;
                  };
                };
                answerSelect: true;
              };
            };
            masterDataType: {
              include: { dataFields: { include: { selectOptions: true } } };
            };
          };
        };
        family: {
          include: { caregivers: true; children: true; comingFrom: true };
        };
        caregiver: true;
        child: true;
        user: { include: { organization: true; subOrganizations: true } };
      };
    };
  };
}>;

export type FullAnswer = Prisma.AnswerGetPayload<{
  include: {
    answerSelect: true;
    answerCollection: {
      include: {
        collectionDataDate: true;
        collectionDataFloat: true;
        collectionDataInt: true;
        collectionDataString: true;
      };
    };
    question: {
      include: {
        defaultAnswerSelectOptions: true;
        selectOptions: true;
      };
    };
  };
}>;

export type PartialAnswer = RecursivePartial<FullAnswer>;

export type IAnswerSelectOtherValue = {
  selectOptionId: string;
  value: string;
};

export type IAnswerSelectOtherValues = IAnswerSelectOtherValue[];

export type FullSubOrganization = Prisma.SubOrganizationGetPayload<{
  include: {
    User: { include: { organization: true; subOrganizations: true } };
  };
}>;

export type FullMasterData = Prisma.MasterDataGetPayload<{
  include: {
    masterDataType: {
      include: {
        dataFields: { include: { selectOptions: true } };
        organization: true;
      };
    };
    createdBy: { include: { organization: true } };
    answers: {
      include: {
        answerSelect: true;
        answerCollection: {
          include: {
            collectionDataDate: true;
            collectionDataFloat: true;
            collectionDataInt: true;
            collectionDataString: true;
          };
        };
      };
    };
  };
}>;

export type FullMasterDataType = Prisma.MasterDataTypeGetPayload<{
  include: {
    dataFields: { include: { selectOptions: true } };
    organization: true;
  };
}>;

export type FullDataField = Prisma.DataFieldGetPayload<{
  include: { selectOptions: true };
}>;

export type FullDataFieldAnswer = Prisma.DataFieldAnswerGetPayload<{
  include: {
    answerSelect: true;
    answerCollection: {
      include: {
        collectionDataDate: true;
        collectionDataFloat: true;
        collectionDataInt: true;
        collectionDataString: true;
      };
    };
  };
}>;

export type FullCollection = Prisma.CollectionGetPayload<{
  include: {
    collectionDataDate: true;
    collectionDataFloat: true;
    collectionDataInt: true;
    collectionDataString: true;
  };
}>;

export type CollectionData =
  | CollectionDataDate
  | CollectionDataInt
  | CollectionDataFloat
  | CollectionDataString;
